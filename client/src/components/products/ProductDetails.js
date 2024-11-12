import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import BackButton from "../common/BackButton";
import Header from "../header/header";
import moment from "moment";

const ProductDetails = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1); // Default quantity

  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return; // Ensure productId is defined
      try {
        const response = await api.get(`products/${productId}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

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
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const deleteReview = async (reviewIndex) => {
    try {
      await api.delete(`/products/${productId}/reviews/${reviewIndex}`);
      // Refresh product details to update reviews
      const response = await api.get(`products/${productId}/`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product._id, quantity); // Use the correct _id property
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="p-6">
        <BackButton />
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
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="border p-4 rounded mb-2">
              <p className="font-bold">{review.name}</p>
              <p>Rating: {review.rating}/5</p>
              <p>{review.comment}</p>
              <p className="text-sm text-gray-500">
                {moment(review.timestamp).format("MMMM Do, YYYY")}
              </p>
              {/* Show delete button for the review author or admin */}
              {(user?.username === review.name || user?.isAdmin) && (
                <button
                  className="text-red-500 mt-2"
                  onClick={() => deleteReview(index)}
                >
                  Delete Review
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
        {!user?.isAdmin && (
          <form onSubmit={submitReview} className="mb-6">
            <p2 className="text-2xl font-bold mt-6 mb-4">Leave a Review</p2>
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
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Submit Review
            </button>
          </form>
        )}
        {!user?.isAdmin && (
          <div className="flex items-center mb-4">
            <button
              className="bg-gray-300 px-2 py-1 rounded"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="mx-2">{quantity}</span>
            <button
              className="bg-gray-300 px-2 py-1 rounded"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        )}
        {!user?.isAdmin && (
          <button
            className="bg-green-500 text-white p-2 rounded mb-4"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
