import React, { useEffect, useState } from "react";
import { FaEye, FaBox, FaTags, FaIndustry, FaDollarSign } from "react-icons/fa";
import CountUp from "react-countup";
import api from "../services/api";

const DashboardCards = () => {
  const [totalViewers, setTotalViewers] = useState(0);
  const [totalProductsInStock, setTotalProductsInStock] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalManufacturers, setTotalManufacturers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total viewers (number of users)
        const usersResponse = await api.get("/user/");
        setTotalViewers(usersResponse.data.length);

        // Fetch all products and calculate total stock
        const productsResponse = await api.get("/products/");
        const totalStock = productsResponse.data.reduce(
          (sum, product) => sum + product.stock_level,
          0
        );
        setTotalProductsInStock(totalStock);

        // Fetch total categories
        const categoriesResponse = await api.get("/categories/");
        setTotalCategories(categoriesResponse.data.length);

        // Fetch total manufacturers
        const manufacturersResponse = await api.get("/manufacturers/");
        setTotalManufacturers(manufacturersResponse.data.length);

        // Fetch total sales
        // Fetch total sales amount
        const salesResponse = await api.get("/orders/all");
        const totalSalesAmount = salesResponse.data.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        setTotalSales(totalSalesAmount);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        console.error("Error message:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {/* Total Viewers Card */}
      <div className="p-6 bg-white rounded shadow-md flex items-center">
        <FaEye className="text-blue-500 text-3xl mr-4" />
        <div>
          <h3 className="text-gray-600 text-sm font-semibold">Total Viewers</h3>
          <CountUp
            end={totalViewers}
            duration={1}
            separator=","
            className="text-2xl font-bold text-gray-800"
          />
        </div>
      </div>

      {/* Total Products in Stock Card */}
      <div className="p-6 bg-white rounded shadow-md flex items-center">
        <FaBox className="text-green-500 text-3xl mr-4" />
        <div>
          <h3 className="text-gray-600 text-sm font-semibold">
            Total Products in Stock
          </h3>
          <CountUp
            end={totalProductsInStock}
            duration={1}
            separator=","
            className="text-2xl font-bold text-gray-800"
          />
        </div>
      </div>

      {/* Total Categories Card */}
      <div className="p-6 bg-white rounded shadow-md flex items-center">
        <FaTags className="text-yellow-500 text-3xl mr-4" />
        <div>
          <h3 className="text-gray-600 text-sm font-semibold">
            Total Categories
          </h3>
          <CountUp
            end={totalCategories}
            duration={1}
            separator=","
            className="text-2xl font-bold text-gray-800"
          />
        </div>
      </div>

      {/* Total Manufacturers Card */}
      <div className="p-6 bg-white rounded shadow-md flex items-center">
        <FaIndustry className="text-purple-500 text-3xl mr-4" />
        <div>
          <h3 className="text-gray-600 text-sm font-semibold">
            Total Manufacturers
          </h3>
          <CountUp
            end={totalManufacturers}
            duration={1}
            separator=","
            className="text-2xl font-bold text-gray-800"
          />
        </div>
      </div>

      {/* Total Sales Card */}
      <div className="p-6 bg-white rounded shadow-md flex items-center">
        <FaDollarSign className="text-orange-500 text-3xl mr-4" />
        <div>
          <h3 className="text-gray-600 text-sm font-semibold">Total Sales</h3>
          <span className="text-2xl font-bold text-gray-800">$</span>{" "}
          <CountUp
            end={totalSales}
            duration={1}
            separator=","
            className="text-2xl font-bold text-gray-800"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
