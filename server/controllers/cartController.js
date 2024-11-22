const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const CanceledOrder = require("../models/CanceledOrder");
const nodemailer = require("nodemailer");

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (Gmail, SMTP, etc.)
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  await transporter.sendMail({
    from: `"PharmaSphere" <${process.env.EMAIL_USER}>`, // Sender
    to, // Receiver
    subject, // Subject
    text, // Plain text content
    html, // HTML content
  });

  console.log("Email sent to:", to);
};

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  console.log("Product ID received:", productId);

  // Check if the productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid Product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if the item is already in the cart
  const existingCartItem = user.cart.find((item) =>
    item.product.equals(productId)
  );
  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  // Populate cart items with product details and send back the updated cart
  const updatedCart = await User.findById(req.user._id).populate(
    "cart.product",
    "name price images"
  );

  res.json(updatedCart.cart);
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.cart = user.cart.filter((item) => !item.product.equals(productId));
  await user.save();
  res.json(user.cart);
});

// Update the quantity of an item in the cart
const updateItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  // Check if the quantity is valid
  if (quantity <= 0) {
    res.status(400);
    throw new Error("Quantity must be greater than zero.");
  }

  // Check if the productId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error("Invalid Product ID");
  }

  // Find the user and the product
  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find the item in the user's cart
  const cartItem = user.cart.find((item) => item.product.equals(productId));

  if (!cartItem) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  // Update the quantity
  cartItem.quantity = quantity;
  await user.save();

  // Populate the cart items with product details and send the updated cart
  const updatedCart = await User.findById(req.user._id).populate(
    "cart.product",
    "name price images"
  );

  res.json(updatedCart.cart);
});

// Checkout and Create Order
const checkout = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingAddress, phoneNumber, paymentMethod } =
    req.body;
  const user = await User.findById(req.user._id);

  const email = user.email; // Get user's email from the database

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400);
    throw new Error("Invalid email address.");
  }

  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country ||
    !phoneNumber ||
    !paymentMethod
  ) {
    console.log("Missing Field:", {
      shippingAddress,
      phoneNumber,
      paymentMethod,
    }); // Log missing fields
    res.status(400);
    throw new Error("All fields in the shipping address are required");
  }

  if (!["card", "cash"].includes(paymentMethod)) {
    res.status(400);
    throw new Error("Invalid payment method. Choose either 'card' or 'cash'.");
  }

  // Validate phone number (e.g., 10-15 digits, no special characters or letters)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phoneNumber)) {
    res.status(400);
    throw new Error(
      "Invalid phone number. It must contain only digits and be between 10 to 15 characters long."
    );
  }

  // Deduct stock levels for each product in the cart
  for (const item of items) {
    const product = await Product.findById(item.product);
    // Check if the product exists
    if (!product) {
      res.status(404);
      throw new Error(`Product with ID ${item.product} not found`);
    }

    // Check if there is enough stock
    if (product.stock_level < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    // Deduct the stock level
    product.stock_level -= item.quantity;
    await product.save();
  }

  // Create a new order with the shipping address
  const order = new Order({
    user,
    items,
    totalAmount,
    shippingAddress,
    phoneNumber,
    paymentMethod,
  });

  const createdOrder = await order.save();

  // Populate items.product to get product details
  await createdOrder.populate("items.product", "name price images");

  // Email receipt
  const emailSubject = "Your Order Receipt";
  const emailText = `Thank you for your order. Your order ID is ${createdOrder._id}.`;
  const emailHtml = `
    <h2>Order Receipt</h2>
    <p>Thank you ${user.username} for ordering from PharmaSphere.</p>
    <p><strong>Order ID:</strong> ${createdOrder._id}</p>
    <p><strong>Total Amount:</strong> $${totalAmount}</p>
    <p><strong>Items:</strong></p>
    <ul>
    ${createdOrder.items
      .map((item) => {
        const productName = item.product?.name || "Unknown Product";
        const productPrice = item.product?.price
          ? `$${item.product.price}`
          : "Price not available";
        const productImage = item.product?.images?.[0]
          ? `<img src="${item.product.images[0]}" alt="${productName}" style="width: 50px; height: 50px;" />`
          : `<span>No Image Available</span>`;

        return `
          <li>
            ${productImage}
            ${productName} (x${item.quantity}) - ${productPrice}
          </li>
        `;
      })
      .join("")}
  </ul>
    <p><strong>Shipping Address:</strong></p>
    <p>${shippingAddress.address}, ${shippingAddress.city}, ${
    shippingAddress.postalCode
  }, ${shippingAddress.country}</p>
    <p><strong>Phone:</strong> ${phoneNumber}</p>
    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
  `;

  await sendEmail(email, emailSubject, emailText, emailHtml);

  //clear the user's cart
  user.cart = [];
  await user.save();

  res.status(201).json(createdOrder);
});

// Get user's cart
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "cart.product",
    "name price images"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.cart);
});

// Get all orders for a user
const getOrders = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const orders = await Order.find({ user }).populate(
    "items.product",
    "name images price"
  );
  res.json(orders);
});

// Cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.status === "Delivered") {
    res.status(400);
    throw new Error("Cannot cancel a delivered order");
  }

  // Move order to CanceledOrder collection
  const canceledOrder = new CanceledOrder({
    user: order.user,
    items: order.items,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    phoneNumber: order.phoneNumber,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
  });

  await canceledOrder.save();

  // Delete the order from the Order collection
  await order.deleteOne();

  res.json({ message: "Order canceled successfully" });
});

// Get canceled orders for a user
const getCanceledOrdersByUser = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const canceledOrders = await CanceledOrder.find({ user }).populate(
    "items.product",
    "name images price"
  );
  res.json(canceledOrders);
});

// Get all cancelled orders
const getAllCanceledOrders = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  if (!req.user || !req.user.isAdmin) {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }

  // Fetch all canceled orders and populate the product details
  // Populate the user and items.product to access the username and product details
  const canceledOrders = await CanceledOrder.find()
    .populate("user", "username") // Populates the user and selects the username
    .populate("items.product", "name price images"); // Populates the product and selects name, price, and images

  res.json(canceledOrders);
});

// Update order status (Admin Only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// Get all orders (Admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  if (!req.user || !req.user.isAdmin) {
    res.status(403);
    throw new Error("Access denied. Admins only.");
  }

  // Fetch all orders and populate the product details
  // Populate the user and items.product to access the username and product details
  const orders = await Order.find()
    .populate("user", "username") // Populates the user and selects the username
    .populate("items.product", "name price images"); // Populates the product and selects name, price, and images

  res.json(orders);
});

module.exports = {
  addToCart,
  checkout,
  getOrders,
  cancelOrder,
  updateOrderStatus,
  removeFromCart,
  getCart,
  getAllOrders,
  updateItemQuantity,
  getCanceledOrdersByUser,
  getAllCanceledOrders,
};
