import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import BackButton from "../common/BackButton";
import Header from "../header/header";
import moment from "moment";
import { FaStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa"; // Importing icons

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

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-80 h-60 object-cover rounded-lg mb-4"
        />
        <p className="text-2xl font-semibold mb-2 text-green-600">
          Price: ${product.price}
        </p>
        <p className="text-sm mb-2 text-gray-600">
          Stock: {product.stock_level}
        </p>
        <p className="mb-4 text-gray-700">{product.description}</p>
        <p className="mb-4 text-gray-500">
          <strong>Category:</strong>{" "}
          {product.category ? product.category.name : "No Category"}
        </p>
        <p className="mb-4 text-gray-500">
          <strong>Manufacturer:</strong>{" "}
          {product.manufacturer ? product.manufacturer.name : "Unknown"}
        </p>
        <p className="mb-4 text-yellow-500 flex items-center">
          <strong>Average Rating:</strong> {product.averageRating}{" "}
          <FaStar className="ml-1" /> (Based on {product.ratingsCount} reviews)
        </p>
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="border p-4 rounded mb-2 bg-gray-50">
              <p className="font-bold text-blue-600">{review.name}</p>
              <p className="text-yellow-500 flex items-center">
                Rating: {review.rating}/5 <FaStar className="ml-1" />
              </p>
              <p>{review.comment}</p>
              <p className="text-sm text-gray-500">
                {moment(review.timestamp).format("MMMM Do, YYYY")}
              </p>
              {(user?.username === review.name || user?.isAdmin) && (
                <button
                  className="text-red-500 mt-2 underline"
                  onClick={() => deleteReview(index)}
                >
                  Delete Review
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
        {!user?.isAdmin && (
          <form onSubmit={submitReview} className="mb-6">
            <h2 className="text-2xl font-bold mt-6 mb-4">Leave a Review</h2>
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Rating</label>
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
              <label className="block mb-2 text-gray-600">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 border rounded w-full"
                placeholder="Write your review here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        )}
        {!user?.isAdmin && (
          <div className="flex items-center mb-4">
            <button
              className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <FaMinus />
            </button>
            <span className="mx-4 font-semibold">{quantity}</span>
            <button
              className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
              onClick={() => setQuantity(quantity + 1)}
            >
              <FaPlus />
            </button>
          </div>
        )}
        {!user?.isAdmin && (
          <button
            className="bg-green-500 text-white p-2 rounded flex items-center hover:bg-green-600"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="mr-2" /> Add to Cart
          </button>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
