import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import ProductForm from "../products/ProductForm";
import { AuthContext } from "../../context/AuthContext";
import Header from "../header/header";
import BackButton from "../common/BackButton"; // Import the BackButton

const CategoryProducts = () => {
  const { categoryId } = useParams(); // Get the category ID from the URL
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch products in the selected category
  const fetchProductsByCategory = async () => {
    try {
      const response = await api.get(`categories/${categoryId}/products/`);
      setProducts(response.data);

      // Fetch category name
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

  return (
    <>
      <Header />
      <div className="p-6">
        <BackButton /> {/* Add the BackButton component */}
        <h1 className="text-3xl font-bold mb-6">Products in {categoryName}</h1>
        {showForm && (
          <ProductForm product={editingProduct} onSave={handleFormSave} />
        )}
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock_level}</p>
              <p>{product.description}</p>

              {/* Only show Edit button if user is an admin */}
              {user && user.isAdmin && (
                <button
                  className="bg-yellow-500 text-white p-2 rounded mt-2 mr-2"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
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
