import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
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
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);

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
      <div className="container relative mx-auto p-6">
        <div className="mb-8">
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
            </>
          ) : (
            <>
              {/* User order alert for non-admin users */}
              {userOrders.length > 0 &&
                userOrders.some((order) => order.status === "Delivered") && (
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
                      Best Collection for <br /> Famous Pharmacy
                    </h1>
                    <p className="text-2 text-white">
                      Discover a curated selection of high-quality
                      pharmaceutical products trusted by thousands. Experience
                      excellence in healthcare with our extensive range designed
                      for your well-being.
                    </p>
                    <button className="mt-12 ">
                      <Link
                        to="/products"
                        className=" bg-sky-500 hover:bg-sky-700 border border-white text-white px-8 py-3 font-medium 
                    rounded-md hover:bg-transparent drop-shadow-lg"
                      >
                        Shop Now
                      </Link>
                    </button>
                  </div>
                </div>
                <div className="bg-cover slider-bg2 bg-no-repeat bg-center py-36">
                  <div className="container px-5 py-4">
                    <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                      Best Collection for <br /> Trusted Pharmacy
                    </h1>
                    <p className="text-2 text-white">
                      Your health is our priority. Explore our trusted pharmacy
                      collection featuring premium medicines and healthcare
                      essentials to support a healthy lifestyle.
                    </p>
                    <button className="mt-12 ">
                      <Link
                        to="/products"
                        className=" bg-sky-500 hover:bg-sky-700 border border-white text-white px-8 py-3 font-medium 
                    rounded-md hover:bg-transparent drop-shadow-lg"
                      >
                        Shop Now
                      </Link>
                    </button>
                  </div>
                </div>
                <div className="bg-cover slider-bg3 bg-no-repeat bg-center py-36">
                  <div className="container px-5 py-4">
                    <h1 className="text-6xl text-white font-medium mb-4 capitalize drop-shadow-lg">
                      Best Collection for <br /> Famous Pharmacy
                    </h1>
                    <p className="text-2 text-white">
                      Shop the finest pharmaceutical brands and ensure your
                      loved ones get the best care. Our famous pharmacy
                      collection is here to meet all your healthcare needs.
                    </p>

                    <button className="mt-12 ">
                      <Link
                        to="/products"
                        className=" bg-sky-500 hover:bg-sky-700 border border-white text-white px-8 py-3 font-medium 
                    rounded-md hover:bg-transparent drop-shadow-lg"
                      >
                        Shop Now
                      </Link>
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
                  <div className="border rounded-lg overflow-hidden shadow transition-transform duration-300 hover:shadow-lg hover:scale-105">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover transition-transform duration-300"
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
                  {/* Image with hover scale effect */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay with text, centered */}
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
