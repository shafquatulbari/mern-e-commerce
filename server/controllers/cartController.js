const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Add to cart (handled on frontend, just an example structure)
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock_level < quantity) {
    res.status(400);
    throw new Error("Insufficient stock");
  }

  // Add the item to the cart (frontend logic, not stored in backend)
  res.json({ message: "Product added to cart", product, quantity });
});

// Checkout and Create Order
const checkout = asyncHandler(async (req, res) => {
  const { items, totalAmount, shippingAddress } = req.body; // Include shippingAddress in the request body
  const user = req.user._id;

  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    res.status(400);
    throw new Error("All fields in the shipping address are required");
  }

  // Create a new order with the shipping address
  const order = new Order({
    user,
    items,
    totalAmount,
    shippingAddress,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// Get all orders for a user
const getOrders = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const orders = await Order.find({ user }).populate(
    "items.product",
    "name price"
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

  await order.deleteOne();
  res.json({ message: "Order cancelled" });
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

module.exports = {
  addToCart,
  checkout,
  getOrders,
  cancelOrder,
  updateOrderStatus,
};
