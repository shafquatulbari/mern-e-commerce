const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false } // prevents Mongoose from creating an _id field for the review
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    //Category not required, by default it is null
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    price: { type: Number, required: true },
    description: { type: String },
    stock_level: { type: Number, required: true },
    images: [{ type: String }], // Array of image URLs
    averageRating: { type: Number, default: 0 }, // Stores average rating of the product
    ratingsCount: { type: Number, default: 0 }, // Counts the number of ratings the product has
    reviews: [reviewSchema], // Array of reviews
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
