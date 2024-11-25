import React, { useEffect, useState } from "react";
import {
  FaTruck,
  FaCheckCircle,
  FaDollarSign,
  FaTimesCircle,
  FaPhoneAlt,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa"; // Importing icons from react-icons
import api from "../../services/api";
import BackButton from "../common/BackButton"; // Adjust path as needed

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canceledOrders, setCanceledOrders] = useState([]);

  useEffect(() => {
    const fetchCanceledOrders = async () => {
      try {
        const response = await api.get("/orders/canceled");
        setCanceledOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch canceled orders:", err);
      }
    };
    fetchCanceledOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Function to cancel an order
  const handleCancelOrder = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      alert("Order canceled successfully.");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div>
      <div className="p-4">
        <BackButton />
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center">You have no orders.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 mb-4 shadow-md bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ID: {order._id}
                </h3>
                <p className="text-gray-600 flex items-center">
                  {order.status === "Delivered" ? (
                    <FaCheckCircle className="mr-2 text-green-500" />
                  ) : (
                    <FaTruck className="mr-2 text-yellow-500" />
                  )}
                  <span className="font-bold">Status:</span> {order.status}
                </p>
                <p className="text-gray-600 flex items-center">
                  <FaDollarSign className="mr-2 text-green-500" />
                  <span className="font-bold">Total Amount:</span> &nbsp; $
                  {order.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Items:</h4>
                <ul className="flex flex-wrap text-gray-600">
                  {order.items.map((item) => (
                    <li
                      key={item.product._id}
                      className="flex items-center mb-2"
                    >
                      {item.product?.images?.[0] ? (
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
                      <span className="text-gray-800">
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

              {order.status === "On-Delivery" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center hover:bg-red-600 transition"
                >
                  <FaTimesCircle className="mr-2" /> Cancel Order
                </button>
              )}
            </div>
          ))
        )}
        <hr className="my-4 mt-9 border-gray-200" />
        <h2 className="text-2xl font-bold mb-4">Canceled Orders</h2>
        {canceledOrders.length === 0 ? (
          <p className="text-gray-600 text-center">
            You have no canceled orders.
          </p>
        ) : (
          canceledOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 mb-4 shadow-md bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order ID: {order._id}
                </h3>
                <p className="text-gray-600 flex items-center">
                  <FaTimesCircle className="mr-2 text-red-500" />
                  <span className="font-bold">Status:</span> {order.status}
                </p>
                <p className="text-gray-600 flex items-center">
                  <FaDollarSign className="mr-2 text-green-500" />
                  <span className="font-bold">Total Amount:</span> &nbsp; $
                  {order.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800">Items:</h4>
                <ul className="flex flex-wrap text-gray-600">
                  {order.items.map((item) => (
                    <li
                      key={item.product._id}
                      className="flex items-center mb-2"
                    >
                      {item.product?.images?.[0] ? (
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
                      <span className="text-gray-800">
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
    </div>
  );
};

export default UserOrders;
