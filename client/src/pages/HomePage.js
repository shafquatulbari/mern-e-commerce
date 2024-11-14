import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/header";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { FaSearch, FaBox, FaTags, FaIndustry, FaTasks } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import icon1 from "../components/images/icons/delivery-van.svg";
import icon2 from "../components/images/icons/money-back.svg";
import icon3 from "../components/images/icons/service-hours.svg";
import DashboardCards from "./DashboardCards";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // Fetch categories for the category section
  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    fetchCategories();
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
      <div className="container relative mx-auto p-6">
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

          {/* Admin-specific content */}
          {user && user.isAdmin ? (
            <>
              <DashboardCards />
              {lowStockProducts.length > 0 && (
                <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-4">
                  <strong>Warning:</strong> The following products have low
                  stock:
                  <ul className="list-disc pl-6 mt-2">
                    {lowStockProducts.map((product) => (
                      <li key={product.id}>
                        {product.name} (Stock: {product.stock_level})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className="bg-purple-500 text-white p-4 rounded mt-4 flex items-center space-x-2 hover:bg-purple-600"
                onClick={() => navigate("/admin/orders")}
              >
                <FaTasks />
                <span>Manage User Orders</span>
              </button>
            </>
          ) : (
            <>
              {/* User order alert for non-admin users */}
              {userOrders.length > 0 && (
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
                <div className=" bg-cover slider-bg1 bg-no-repeat bg-center py-36">
                  <div className="container px-5 py-4">
                    <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                      best collection for <br /> Famous Pharmacy
                    </h1>
                    <p className="text-2 text-white">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Aperiam <br />
                      accusantium perspiciatis, sapiente magni eos dolorum ex
                      quos dolores odio
                    </p>
                    <button className="mt-12 ">
                      <a
                        href="/"
                        className=" bg-sky-500 hover:bg-sky-700 border border-white text-white px-8 py-3 font-medium 
                    rounded-md hover:bg-transparent drop-shadow-lg"
                      >
                        Shop Now
                      </a>
                    </button>
                  </div>
                </div>
                <div className="bg-cover slider-bg2 bg-no-repeat bg-center py-36">
                  <div className="container px-5 py-4">
                    <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                      best collection for <br /> Trusted Pharmacy
                    </h1>
                    <p className="text-2 text-white">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Aperiam <br />
                      accusantium perspiciatis, sapiente magni eos dolorum ex
                      quos dolores odio
                    </p>
                    <button className="mt-12 ">
                      <a
                        href="/"
                        className=" bg-sky-500 hover:bg-sky-700 border border-white text-white px-8 py-3 font-medium 
                    rounded-md hover:bg-transparent drop-shadow-lg"
                      >
                        Shop Now
                      </a>
                    </button>
                  </div>
                </div>
                <div className="bg-cover slider-bg3 bg-no-repeat bg-center py-36">
                  <div className="container px-5 py-4">
                    <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                      best collection for <br /> Famous Pharmacy
                    </h1>
                    <p className="text-2 text-white">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Aperiam <br />
                      accusantium perspiciatis, sapiente magni eos dolorum ex
                      quos dolores odio
                    </p>
                    <button className="mt-12 ">
                      <a
                        href="/"
                        className=" bg-sky-500 hover:bg-sky-700 border border-white text-white px-8 py-3 font-medium 
                    rounded-md hover:bg-transparent drop-shadow-lg"
                      >
                        Shop Now
                      </a>
                    </button>
                  </div>
                </div>
              </Slider>

              {/* Features Section */}
              <div className="container py-16">
                <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
                  {/* Feature Cards */}
                  <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                    <img
                      src={icon1}
                      alt="Delivery"
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h4 className="font-medium capitalize text-lg">
                        Free Shipping
                      </h4>
                      <p className="text-gray-500 text-sm">Order over $200</p>
                    </div>
                  </div>
                  <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                    <img
                      src={icon2}
                      alt="Money Back"
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h4 className="font-medium capitalize text-lg">
                        Money Returns
                      </h4>
                      <p className="text-gray-500 text-sm">
                        30 days money return
                      </p>
                    </div>
                  </div>
                  <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
                    <img
                      src={icon3}
                      alt="Service Hours"
                      className="w-12 h-12 object-contain"
                    />
                    <div>
                      <h4 className="font-medium capitalize text-lg">
                        24/7 Support
                      </h4>
                      <p className="text-gray-500 text-sm">Customer support</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

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

          {/* Category Section */}
          <div className="container py-16">
            <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6">
              Shop by Category
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="relative rounded-sm overflow-hidden group"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <Link
                    to={`/categories/${category._id}/products`}
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
