import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTruck,
  FaCheckCircle,
  FaDollarSign,
  FaTimesCircle,
} from "react-icons/fa"; // Importing icons from react-icons
import api from "../../services/api";
import BackButton from "../common/BackButton"; // Adjust path as needed

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
              className="border rounded-lg p-4 mb-4 shadow-md bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Order ID: {order._id}
              </h3>
              <p className="text-gray-600 mb-2 flex items-center">
                {order.status === "Delivered" ? (
                  <FaCheckCircle className="mr-2 text-green-500" />
                ) : (
                  <FaTruck className="mr-2 text-yellow-500" />
                )}
                <span className="font-bold">Status:</span> {order.status}
              </p>
              <p className="text-gray-600 mb-2 flex items-center">
                <FaDollarSign className="mr-2 text-green-500" />
                <span className="font-bold">Total Amount:</span> $
                {order.totalAmount.toFixed(2)}
              </p>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-800">Items:</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.product._id} className="flex items-center">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded mr-2"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded mr-2 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-800">
                          {item.product ? item.product.name : "Unknown Product"}{" "}
                          (x{item.quantity})
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-800">
                  Shipping Address:
                </h4>
                <p className="text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
              {order.status === "On-Delivery" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4 flex items-center hover:bg-red-600 transition"
                >
                  <FaTimesCircle className="mr-2" /> Cancel Order
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserOrders;
