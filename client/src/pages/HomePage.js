import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/header"; // Ensure this path is correct
import { AuthContext } from "../context/AuthContext"; // Correctly imported context
import api from "../services/api"; // Correctly imported API service
import { FaSearch, FaBox, FaTags, FaIndustry } from "react-icons/fa"; // Import icons
import "slick-carousel/slick/slick.css"; // Correct styles for react-slick
import "slick-carousel/slick/slick-theme.css"; // Additional styles for react-slick
import Slider from "react-slick"; // Ensure `react-slick` is correctly installed

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch top 8 products for the carousel
  const fetchTopProducts = async () => {
    try {
      const response = await api.get("products/");
      setTopProducts(response.data.slice(0, 8)); // Get top 8 products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Check for low stock products (admin only)
  const checkLowStock = async () => {
    try {
      const response = await api.get("products/");
      const lowStockItems = response.data.filter(
        (product) => product.stock_level < 3
      );
      setLowStockProducts(lowStockItems);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch user orders (for non-admin users)
  const fetchUserOrders = async () => {
    try {
      const response = await api.get("/orders");
      setUserOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchTopProducts();
    if (user) {
      if (user.isAdmin) {
        checkLowStock();
      } else {
        fetchUserOrders();
      }
    }
  }, [user]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Slider settings for React Slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const productCarouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-l flex-grow"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white p-2 rounded-r"
            >
              <FaSearch />
            </button>
          </div>

          {/* Navigation Buttons with Icons */}
          <div className="flex justify-center mt-8 space-x-4">
            <Link
              to="/products"
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"
            >
              <FaBox />
              <span>View Products</span>
            </Link>
            <Link
              to="/categories"
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center space-x-2"
            >
              <FaTags />
              <span>View Categories</span>
            </Link>
            <Link
              to="/manufacturers"
              className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center space-x-2"
            >
              <FaIndustry />
              <span>View Manufacturers</span>
            </Link>
          </div>

          {/* Low stock alert for admin */}
          {user && user.isAdmin && lowStockProducts.length > 0 && (
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-4">
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

          {/* User order alert for non-admin users */}
          {user && !user.isAdmin && userOrders.length > 0 && (
            <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
              <strong>Order Updates:</strong>
              <ul className="list-disc pl-6 mt-2">
                {userOrders
                  .filter((order) => order.status === "Delivered")
                  .map((order) => (
                    <li key={order._id}>
                      Your order with ID {order._id} has been delivered.
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Pharmacy/Medicine Sliders */}
          <Slider {...sliderSettings}>
            <div className="h-64 bg-blue-200 flex items-center justify-center">
              <h2 className="text-3xl font-bold">Quality Medicines</h2>
            </div>
            <div className="h-64 bg-green-200 flex items-center justify-center">
              <h2 className="text-3xl font-bold">Trusted Pharmacy</h2>
            </div>
            <div className="h-64 bg-yellow-200 flex items-center justify-center">
              <h2 className="text-3xl font-bold">Affordable Prices</h2>
            </div>
          </Slider>
        </div>

        {/* Product Carousel */}
        <h2 className="text-2xl font-bold mb-4">Top Products</h2>
        <Slider {...productCarouselSettings}>
          {topProducts.map((product) => (
            <div key={product._id} className="p-4">
              <Link to={`/products/${product._id}`}>
                <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-gray-500">
                      {product.manufacturer
                        ? product.manufacturer.name
                        : "Unknown Manufacturer"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default HomePage;
