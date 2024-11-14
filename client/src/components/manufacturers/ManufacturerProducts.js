import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import ProductForm from "../products/ProductForm";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import BackButton from "../common/BackButton";
import moment from "moment";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";

const ManufacturerProducts = () => {
  const { manufacturerId } = useParams();
  const [products, setProducts] = useState([]);
  const [manufacturerName, setManufacturerName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);
  const { addItem, updateItemQuantity } = useContext(CartContext);

  const fetchProductsByManufacturer = async () => {
    try {
      const response = await api.get(
        `manufacturers/${manufacturerId}/products/`
      );
      setProducts(response.data);
      const manufacturerResponse = await api.get(
        `manufacturers/${manufacturerId}/`
      );
      setManufacturerName(manufacturerResponse.data.name);
    } catch (error) {
      console.error("Error fetching products by manufacturer:", error);
    }
  };

  useEffect(() => {
    fetchProductsByManufacturer();
  }, [manufacturerId]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSave = () => {
    fetchProductsByManufacturer();
    setShowForm(false);
  };

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">
          Products from {manufacturerName}
        </h1>
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
                      updateItemQuantity(
                        product._id,
                        Math.max(1, product.quantity - 1)
                      )
                    }
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4">{product.quantity || 1}</span>
                  <button
                    className="bg-gray-300 p-2 rounded hover:bg-gray-400"
                    onClick={() => addItem(product._id, 1)}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="bg-blue-500 text-white p-2 rounded ml-2 hover:bg-blue-600 flex items-center"
                    onClick={() => addItem(product._id, 1)}
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <Link to="/manufacturers" className="mt-4 inline-block text-blue-500">
          Back to Manufacturers
        </Link>
      </div>
    </>
  );
};

export default ManufacturerProducts;
