import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import BackButton from "../common/BackButton";
import moment from "moment";
import { FaStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const response = await api.get(`products/${productId}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        name: user ? user.username : "Anonymous",
        rating,
        comment,
      });
      setProduct(response.data);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const deleteReview = async (reviewIndex) => {
    try {
      await api.delete(`/products/${productId}/reviews/${reviewIndex}`);
      const response = await api.get(`products/${productId}/`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product._id, quantity);
    }
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="p-8 max-w-6xl mx-auto bg-white shadow rounded-lg">
        <BackButton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full max-w-md h-auto object-cover rounded-lg shadow"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold text-green-600">
              ${product.price}
            </p>
            <p className="text-sm text-gray-600">
              Stock: {product.stock_level}
            </p>
            <p className="text-gray-700">{product.description}</p>
            <div className="text-gray-500 space-y-1">
              <p>
                <strong>Category:</strong>{" "}
                {product.category ? product.category.name : "No Category"}
              </p>
              <p>
                <strong>Manufacturer:</strong>{" "}
                {product.manufacturer ? product.manufacturer.name : "Unknown"}
              </p>
              <p className="flex items-center text-yellow-500">
                <strong>Average Rating:</strong>{" "}
                <span className="ml-2">
                  {product.averageRating} <FaStar className="inline ml-1" />{" "}
                  (Based on {product.ratingsCount} reviews)
                </span>
              </p>
            </div>
            {!user?.isAdmin && (
              <div className="flex items-center space-x-4">
                <button
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <FaMinus />
                </button>
                <span className="font-semibold">{quantity}</span>
                <button
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <FaPlus />
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center hover:bg-green-600"
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border p-4 rounded bg-gray-50 shadow-sm"
                >
                  <p className="font-bold text-blue-600">{review.name}</p>
                  <p className="text-yellow-500 flex items-center">
                    Rating: {review.rating}/5 <FaStar className="ml-1" />
                  </p>
                  <p className="text-gray-700">{review.comment}</p>
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
          </div>
          {!user?.isAdmin && (
            <form onSubmit={submitReview} className="mt-6 space-y-4">
              <h2 className="text-2xl font-bold">Leave a Review</h2>
              <div>
                <label className="block mb-1 text-gray-600">Rating</label>
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
              <div>
                <label className="block mb-1 text-gray-600">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="p-2 border rounded w-full"
                  placeholder="Write your review here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
