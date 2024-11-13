import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import ProductForm from "./ProductForm";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Header from "../header/header";
import BackButton from "../common/BackButton";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa"; // Import icons

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);
  const { addItem, updateItemQuantity } = useContext(CartContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");

  // Fetch products and filter by search query if provided
  const fetchProducts = async () => {
    try {
      const response = await api.get("products/");
      let filteredProducts = response.data;

      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`products/${id}/`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleFormSave = () => {
    fetchProducts();
    setShowForm(false);
  };

  const handleAddToCart = (product) => {
    addItem(product._id, 1); // Adds the product to the cart with a default quantity of 1
  };

  const handleQuantityChange = (productId, quantity) => {
    updateItemQuantity(productId, quantity); // Updates item quantity in the cart
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        {user && user.isAdmin && (
          <button
            className="bg-green-500 text-white p-2 rounded mb-4 hover:bg-green-600"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        )}

        {showForm && (
          <ProductForm product={editingProduct} onSave={handleFormSave} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <Link to={`/products/${product._id}`}>
                <h3 className="text-xl font-bold mb-2 text-blue-600 hover:underline">
                  {product.name}
                </h3>
                <img
                  src={product.images[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-80 h-60 object-cover mb-2 rounded-md"
                />
              </Link>
              <p className="text-lg text-green-600 font-semibold mb-1">
                Price: ${product.price}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Stock: {product.stock_level}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Category:{" "}
                {product.category ? product.category.name : "No Category"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Manufacturer:{" "}
                {product.manufacturer ? product.manufacturer.name : "Unknown"}
              </p>
              <p className="text-sm text-yellow-500 mb-2">
                Rating: {product.averageRating}{" "}
                <FaStar className="inline ml-1" /> ({product.ratingsCount}{" "}
                reviews)
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Updated:{" "}
                {moment(product.updatedAt).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
              {user && user.isAdmin ? (
                <>
                  <button
                    className="bg-yellow-500 text-white p-2 rounded mt-2 mr-2 hover:bg-yellow-600"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </>
              ) : (
                <div className="flex items-center mt-4">
                  <button
                    className="bg-gray-300 px-3 py-1 rounded-l hover:bg-gray-400"
                    onClick={() =>
                      handleQuantityChange(
                        product._id,
                        Math.max(1, product.quantity - 1)
                      )
                    }
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 py-1 bg-gray-100 border-t border-b border-gray-300">
                    {product.quantity || 1}
                  </span>
                  <button
                    className="bg-gray-300 px-3 py-1 rounded-r hover:bg-gray-400"
                    onClick={() =>
                      handleQuantityChange(product._id, product.quantity + 1)
                    }
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
