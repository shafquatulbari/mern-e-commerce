import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import ProductForm from "./ProductForm";
import { AuthContext } from "../../context/AuthContext";
import Header from "../header/header";
import BackButton from "../common/BackButton";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const response = await api.get("products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  return (
    <>
      <Header />
      <div className="p-6">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        {user && user.isAdmin && (
          <button
            className="bg-green-500 text-white p-2 rounded mb-4"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        )}

        {showForm && (
          <ProductForm product={editingProduct} onSave={handleFormSave} />
        )}

        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock_level}</p>
              <p>
                Category:{" "}
                {product.category ? product.category.name : "No Category"}
              </p>{" "}
              {/* Handle null category */}
              <p>{product.description}</p>
              {user && user.isAdmin && (
                <>
                  <button
                    className="bg-yellow-500 text-white p-2 rounded mt-2 mr-2"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded mt-2"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
