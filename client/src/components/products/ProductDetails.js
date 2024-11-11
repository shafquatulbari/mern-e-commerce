import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../header/header";
import moment from "moment";

const ProductDetails = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Handle review submission
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        name: user ? user.username : "Anonymous",
        rating,
        comment,
      });
      setProduct(response.data); // Update the product with the new review
      setName("");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <img
          src={product.images?.[0] || "https://via.placeholder.com/150"}
          alt={product.name}
          className="mb-4"
        />
        <p className="text-xl mb-2">Price: ${product.price}</p>
        <p className="mb-2">Stock: {product.stock_level}</p>
        <p className="mb-4">{product.description}</p>
        <p className="mb-4">
          Category: {product.category ? product.category.name : "No Category"}
        </p>
        <p className="mb-4">
          Manufacturer:{" "}
          {product.manufacturer ? product.manufacturer.name : "Unknown"}
        </p>
        <p className="mb-4">
          Average Rating: {product.averageRating} (Based on{" "}
          {product.ratingsCount} reviews)
        </p>

        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {product?.reviews?.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="border p-4 rounded mb-2">
              <p className="font-bold">{review.name}</p>
              <p>Rating: {review.rating}/5</p>
              <p>{review.comment}</p>
              <p className="text-sm text-gray-500">
                {moment(review.timestamp).format("MMMM Do, YYYY")}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        <h2 className="text-2xl font-bold mt-6 mb-4">Leave a Review</h2>
        <form onSubmit={submitReview} className="mb-6">
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="p-2 border rounded w-full"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit Review
          </button>
        </form>
      </div>
    </>
  );
};

export default ProductDetails;
