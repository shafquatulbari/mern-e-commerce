import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header/header"; // Ensure this path is correct
import { AuthContext } from "../context/AuthContext"; // Correctly imported context
import api from "../services/api"; // Correctly imported API service
import { FaSearch, FaBox, FaTags, FaIndustry } from "react-icons/fa"; // Import icons
import "slick-carousel/slick/slick.css"; // Correct styles for react-slick
import "slick-carousel/slick/slick-theme.css"; // Additional styles for react-slick
import Slider from "react-slick"; // Ensure `react-slick` is correctly installed
import icon1 from "../components/images/icons/delivery-van.svg";
import icon2 from "../components/images/icons/money-back.svg";
import icon3 from "../components/images/icons/service-hours.svg";

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

          {/* Admin button to view all user orders */}
          {user && user.isAdmin && (
            <div className="mb-6">
              <button
                className="bg-purple-500 text-white p-4 rounded"
                onClick={() => navigate("/admin/orders")}
              >
                Manage User Orders
              </button>
            </div>
          )}

          {/* Pharmacy/Medicine Sliders */}
          <Slider {...sliderSettings}>
            <div className=" bg-cover slider-bg1 bg-no-repeat bg-center py-36 rounded">
              <div className="container px-5 py-4">
                <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                  best collection for <br /> Famous Pharmacy
                </h1>
                <p className="text-2 text-white">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aperiam <br />
                  accusantium perspiciatis, sapiente magni eos dolorum ex quos
                  dolores odio
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
            <div className="bg-cover slider-bg2 bg-no-repeat bg-center py-36 rounded">
              <div className="container px-5 py-4">
                <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                  best collection for <br /> Trusted Pharmacy
                </h1>
                <p className="text-2 text-white">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aperiam <br />
                  accusantium perspiciatis, sapiente magni eos dolorum ex quos
                  dolores odio
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
            <div className="bg-cover slider-bg3 bg-no-repeat bg-center py-36 rounded">
              <div className="container px-5 py-4">
                <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                  best collection for <br /> Famous Pharmacy
                </h1>
                <p className="text-2 text-white">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aperiam <br />
                  accusantium perspiciatis, sapiente magni eos dolorum ex quos
                  dolores odio
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
        </div>
        {/* <!-- features --> */}
        <div className="container py-16">
          <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
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
                alt="Delivery"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h4 className="font-medium capitalize text-lg">
                  Money Returns
                </h4>
                <p className="text-gray-500 text-sm">30 days money return</p>
              </div>
            </div>
            <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
              <img
                src={icon3}
                alt="Delivery"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h4 className="font-medium capitalize text-lg">24/7 Support</h4>
                <p className="text-gray-500 text-sm">Customer support</p>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- ./features --> */}
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
        {/* <div class="container py-16">
          <h2 class="text-2xl font-medium text-gray-800 uppercase mb-6">
            shop by category
          </h2>
          <div class="grid grid-cols-3 gap-3">
            <div class="relative rounded-sm overflow-hidden group">
              <img
                src={img1}
                alt="category 1"
                class="w-full h-full object-cover"
              />
              <a
                href="/"
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
              >
                Antihistamines (Allergy Medications)
              </a>
            </div>
            <div class="relative rounded-sm overflow-hidden group">
              <img
                src={img2}
                alt="category 1"
                class="w-full h-full object-cover"
              />
              <a
                href="/"
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
              >
                Mattrass
              </a>
            </div>
            <div class="relative rounded-sm overflow-hidden group">
              <img
                src="assets/images/category/category-3.jpg"
                alt="category 1"
                class="w-full"
              />
              <a
                href="/"
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
              >
                Outdoor
              </a>
            </div>
            <div class="relative rounded-sm overflow-hidden group">
              <img
                src="assets/images/category/category-4.jpg"
                alt="category 1"
                class="w-full"
              />
              <a
                href="/"
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
              >
                Sofa
              </a>
            </div>
            <div class="relative rounded-sm overflow-hidden group">
              <img
                src="assets/images/category/category-5.jpg"
                alt="category 1"
                class="w-full"
              />
              <a
                href="/"
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
              >
                Living Room
              </a>
            </div>
            <div class="relative rounded-sm overflow-hidden group">
              <img
                src="assets/images/category/category-6.jpg"
                alt="category 1"
                class="w-full"
              />
              <a
                href="/"
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-xl text-white font-roboto font-medium group-hover:bg-opacity-60 transition"
              >
                Kitchen
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default HomePage;
