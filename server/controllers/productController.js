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

const searchProductsOCR = asyncHandler(async (req, res) => {
  const searchQuery = req.query.search; // Extract the search query

  if (!searchQuery) {
    res.status(400);
    throw new Error("Search query is required");
  }

  try {
    // Check for prescription-related keywords
    const validPrescriptionKeywords = ["hospital", "clinic", "care", "dr"];
    const lowerCaseQuery = searchQuery.toLowerCase();
    const containsPrescriptionKeywords = validPrescriptionKeywords.some(
      (keyword) => lowerCaseQuery.includes(keyword)
    );

    if (!containsPrescriptionKeywords) {
      return res
        .status(400)
        .json({ message: "This does not appear to be a valid prescription." });
    }

    // Preprocess the text to extract valid medicine names
    const keywords = searchQuery
      .split(/\s+/)
      .map((word) => word.replace(/[^a-zA-Z]/g, "").trim()) // Remove numbers, punctuation
      .filter((word) => word.length > 0 && isNaN(word)); // Filter out empty strings and numbers

    console.log("Processed Keywords:", keywords); // Debugging

    if (keywords.length === 0) {
      return res.status(400).json({
        message: "No valid medicine names found in the prescription.",
      });
    }

    // Attempt exact match first
    const exactRegexArray = keywords.map(
      (keyword) => new RegExp(`^${keyword}$`, "i") // Exact match
    );

    let products = await Product.find({
      $or: exactRegexArray.map((regex) => ({ name: regex })),
    });

    // If no products found, try partial match
    if (products.length === 0) {
      const partialRegexArray = keywords.map(
        (keyword) => new RegExp(keyword, "i") // Partial match
      );

      products = await Product.find({
        $or: partialRegexArray.map((regex) => ({ name: regex })),
      });
    }

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching medicines found in our store." });
    }

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Error searching products" });
  }
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

// Get a product by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("manufacturer", "name");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Add a new product
const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    manufacturer,
    price,
    stock_level,
    description,
    images,
  } = req.body;
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
    manufacturer,
    images,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    manufacturer,
    price,
    description,
    stock_level,
    images,
  } = req.body;
  const product = await Product.findById(id);

  if (product) {
    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.description = description || product.description;
    product.stock_level = stock_level || product.stock_level;
    product.manufacturer = manufacturer || product.manufacturer;
    product.images = images || product.images;

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

// Add a review to a product
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, rating, comment } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    const review = {
      name: name || "Anonymous",
      rating: Number(rating),
      comment,
      timestamp: new Date(),
    };

    // Add the new review
    product.reviews.push(review);

    // Update average rating and review count
    product.ratingsCount = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// Delete a review from a product
const deleteReview = asyncHandler(async (req, res) => {
  const { productId, reviewIndex } = req.params;
  const product = await Product.findById(productId);

  if (product) {
    const review = product.reviews[reviewIndex];
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    // Check if the user is the review author or an admin
    const requestingUser = req.user;
    if (
      review.name !== requestingUser.username && // Review author's name check
      !requestingUser.isAdmin // Admin check
    ) {
      res.status(403);
      throw new Error("You are not authorized to delete this review");
    }

    // Remove the review and update product details
    product.reviews.splice(reviewIndex, 1);
    product.ratingsCount = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      (product.reviews.length || 1); // Avoid division by zero

    await product.save();
    res.json(product);
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
  addReview,
  deleteReview,
  getProductById,
  searchProductsOCR,
};
