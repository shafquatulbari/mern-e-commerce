// src/pages/AdminOrderPage.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/common/BackButton";
import {
  FaCheckCircle,
  FaTruck,
  FaPhoneAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaTimesCircle,
} from "react-icons/fa";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canceledOrders, setCanceledOrders] = useState([]);

  // Fetch all orders
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await api.get("/orders/all");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  // Fetch canceled orders
  useEffect(() => {
    const fetchCanceledOrders = async () => {
      try {
        const response = await api.get("/orders/canceled/all");
        setCanceledOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch canceled orders:", err);
      }
    };
    fetchCanceledOrders();
  }, []);

  // Update order status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="p-4">
        <BackButton />
        <h2 className="text-2xl font-bold mb-4">All User Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 mb-4 shadow-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ID: {order._id}
                </h3>
                <p className="text-gray-600">
                  <span className="font-bold">User:</span> {order.user.username}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Status:</span>{" "}
                  {order.status === "Delivered" ? (
                    <FaCheckCircle className="inline text-green-500" />
                  ) : (
                    <FaTruck className="inline text-yellow-500" />
                  )}{" "}
                  {order.status}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Total Amount:</span> $
                  {order.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Items:</h4>
                <ul className="flex flex-wrap space-x-2 text-gray-600">
                  {order.items.map((item) => (
                    <li
                      key={item.product._id}
                      className="flex items-center mb-2"
                    >
                      {item.product.images && item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded mr-2"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded mr-2 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                      <span>
                        {item.product ? item.product.name : "Unknown Product"}{" "}
                        (x
                        {item.quantity})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">
                  Shipping Address:
                </h4>
                <p className="text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Phone Number:</h4>
                <p className="text-gray-600 flex items-center">
                  <FaPhoneAlt className="mr-2 text-blue-500" />
                  {order.phoneNumber}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Payment Method:</h4>
                <p className="text-gray-600 flex items-center">
                  {order.paymentMethod === "card" ? (
                    <FaCreditCard className="mr-2 text-green-500" />
                  ) : (
                    <FaMoneyBillWave className="mr-2 text-yellow-500" />
                  )}
                  {order.paymentMethod === "card"
                    ? "Paid by Card"
                    : "Cash on Delivery"}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <label htmlFor="status" className="font-semibold text-gray-800">
                  Update Status:
                </label>
                <select
                  id="status"
                  value={order.status}
                  onChange={(e) =>
                    handleUpdateStatus(order._id, e.target.value)
                  }
                  className="ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="On-Delivery">On-Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
        <hr className="my-4 mt-9 border-gray-200" />
        <h2 className="text-2xl font-bold mb-4">All Canceled Orders</h2>
        {canceledOrders.length === 0 ? (
          <p>No canceled orders found.</p>
        ) : (
          canceledOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 mb-4 shadow-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ID: {order._id}
                </h3>
                <p className="text-gray-600">
                  <span className="font-bold">User:</span> {order.user.username}
                </p>
                <p className="text-gray-600">
                  <FaTimesCircle className="mr-2 text-red-500" />
                  <span className="font-bold">Status:</span> Canceled
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Total Amount:</span> $
                  {order.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Items:</h4>
                <ul className="flex flex-wrap space-x-2 text-gray-600">
                  {order.items.map((item) => (
                    <li
                      key={item.product._id}
                      className="flex items-center mb-2"
                    >
                      {item.product.images && item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded mr-2"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded mr-2 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                      <span>
                        {item.product ? item.product.name : "Unknown Product"}{" "}
                        (x
                        {item.quantity})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">
                  Shipping Address:
                </h4>
                <p className="text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Phone Number:</h4>
                <p className="text-gray-600 flex items-center">
                  <FaPhoneAlt className="mr-2 text-blue-500" />
                  {order.phoneNumber}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Payment Method:</h4>
                <p className="text-gray-600 flex items-center">
                  {order.paymentMethod === "card" ? (
                    <FaCreditCard className="mr-2 text-green-500" />
                  ) : (
                    <FaMoneyBillWave className="mr-2 text-yellow-500" />
                  )}
                  {order.paymentMethod === "card"
                    ? "Paid by Card"
                    : "Cash on Delivery"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminOrderPage;
