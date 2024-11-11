import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/header";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Hook to navigate

  // Fetch products and check for low stock
  const checkLowStock = async () => {
    try {
      const response = await api.get("products/"); // Fetch all products
      const lowStockItems = response.data.filter(
        (product) => product.stock_level < 3
      );
      setLowStockProducts(lowStockItems);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to ProductList page and pass the search query as a URL parameter
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      checkLowStock();
    }
  }, [user]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-5xl font-bold mb-6">
          {user
            ? user.isAdmin
              ? `Hi, ${user.username}, welcome to the admin dashboard`
              : `Hello ${user.username}, welcome to the user dashboard`
            : "Loading..."}
        </h1>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for a product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Display low stock alert if admin */}
        {user && user.isAdmin && lowStockProducts.length > 0 && (
          <div className="bg-yellow-100 text-yellow-700 p-4 mb-6 rounded">
            <strong>Warning:</strong> The following products have low stock:
            <ul className="list-disc pl-6 mt-2">
              {lowStockProducts.map((product) => (
                <li key={product.id}>
                  {product.name} (Stock: {product.stock_level})
                </li>
              ))}
            </ul>
          </div>
        )}

        {user && (
          <div className="flex">
            <Link
              to="/products"
              className="bg-blue-500 text-white p-4 rounded mr-4"
            >
              View Products
            </Link>
            <Link
              to="/categories"
              className="bg-green-500 text-white p-4 rounded"
            >
              View Categories
            </Link>
            <Link
              to="/manufacturers"
              className="bg-yellow-500 text-white p-4 rounded ml-4"
            >
              View Manufacturers
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
