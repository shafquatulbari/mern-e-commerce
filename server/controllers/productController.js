const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("category", "name");
  // With this, each product will have a category field that includes the name
  //of the category, accessible as product.category.name in your frontend.
  res.json(products);
});

// Add a new product
const addProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock_level, description } = req.body;
  const existingProduct = await Product.findOne({ name });

  if (existingProduct) {
    res.status(400).json({ error: "Product already exists." });
    return;
  }

  const product = new Product({
    name,
    category,
    price,
    stock_level,
    description,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, stock_level } = req.body;
  const product = await Product.findById(id);

  if (product) {
    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock_level = stock_level || product.stock_level;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
