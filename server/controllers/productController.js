const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const mongoose = require("mongoose");

//Search for a product by name
const searchProducts = asyncHandler(async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the URL query string

  if (!searchQuery) {
    res.status(400);
    throw new Error("Search query is required");
  }

  // Using a regular expression to search for products where the name contains the search query
  const products = await Product.find({
    name: { $regex: searchQuery, $options: "i" }, // "i" makes the search case-insensitive
  });

  res.json(products);
});

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const { category, manufacturer, sortBy, order = "desc" } = req.query;
  let query = {};

  // Filtering by category
  if (category) {
    // Check if the category is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(category)) {
      query.category = category;
    } else {
      return res.status(400).json({ message: "Invalid category ID" });
    }
  }
  // Filtering by manufacturer
  if (manufacturer) {
    // Check if the manufacturer is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(manufacturer)) {
      query.manufacturer = manufacturer;
    } else {
      return res.status(400).json({ message: "Invalid manufacturer ID" });
    }
  }

  // Sorting logic
  let sortOptions = {};
  if (sortBy === "dateAdded") {
    sortOptions.createdAt = order === "asc" ? 1 : -1; // Ascending or Descending
  } else if (sortBy === "dateUpdated") {
    sortOptions.updatedAt = order === "asc" ? 1 : -1; // Ascending or Descending
  }

  const products = await Product.find(query)
    .populate("category", "name")
    .populate("manufacturer", "name")
    .sort(sortOptions); // Apply sorting options
  // With this, each product will have a category field that includes the name
  //of the category, accessible as product.category.name in your frontend.
  // With this, each product will have a manufacturer field that includes the name
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

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
