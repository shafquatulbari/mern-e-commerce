import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import ProductForm from "../products/ProductForm";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

import BackButton from "../common/BackButton";
import moment from "moment";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);

  const fetchProductsByCategory = async () => {
    try {
      const response = await api.get(`categories/${categoryId}/products/`);
      setProducts(
        response.data.map((product) => ({ ...product, quantity: 1 })) // Set default quantity
      );
      const categoryResponse = await api.get(`categories/${categoryId}/`);
      setCategoryName(categoryResponse.data.name);
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [categoryId]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSave = () => {
    fetchProductsByCategory();
    setShowForm(false);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              quantity: Math.min(newQuantity, product.stock_level), // Prevent exceeding stock level
            }
          : product
      )
    );
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">Products in {categoryName}</h1>
        {showForm && (
          <ProductForm product={editingProduct} onSave={handleFormSave} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
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
              <p className="text-sm text-gray-600 mb-2">
                {product.description}
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Updated: {moment(product.updatedAt).format("MMMM Do, YYYY")}
              </p>
              {user && user.isAdmin ? (
                <button
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
              ) : (
                <div className="flex items-center mt-2">
                  <button
                    className="bg-gray-300 p-2 rounded hover:bg-gray-400"
                    onClick={() =>
                      handleQuantityChange(
                        product._id,
                        Math.max(1, product.quantity - 1)
                      )
                    }
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4">{product.quantity}</span>
                  <button
                    className="bg-gray-300 p-2 rounded hover:bg-gray-400"
                    onClick={() =>
                      handleQuantityChange(product._id, product.quantity + 1)
                    }
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="bg-blue-500 text-white p-2 rounded ml-2 hover:bg-blue-600 flex items-center"
                    onClick={() => {
                      addItem(product._id, product.quantity); // Add product to the cart
                      setProducts((prevProducts) =>
                        prevProducts.map((p) =>
                          p._id === product._id ? { ...p, quantity: 1 } : p
                        )
                      ); // Reset quantity to 1
                    }}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <Link to="/categories" className="mt-4 inline-block text-blue-500">
          Back to Categories
        </Link>
      </div>
    </>
  );
};

export default CategoryProducts;
