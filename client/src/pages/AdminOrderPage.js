// src/pages/AdminOrderPage.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import BackButton from "../components/common/BackButton";

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Header />
      <div className="p-4">
        <BackButton />
        <h2 className="text-2xl font-bold mb-4">All User Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 mb-4 shadow-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Order ID: {order._id}
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">User:</span> {order.user.username}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Status:</span>{" "}
                {order.status === "Delivered" ? (
                  <FaCheckCircle className="inline text-green-500" />
                ) : (
                  <FaTruck className="inline text-yellow-500" />
                )}{" "}
                {order.status}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Total Amount:</span> $
                {order.totalAmount.toFixed(2)}
              </p>
              <div className="mt-2">
                <h4 className="font-semibold text-gray-800">Items:</h4>
                <ul className="list-disc pl-6 text-gray-600">
                  {order.items.map((item) => (
                    <li key={item.product._id} className="flex items-center">
                      {item.product.images && item.product.images[0] ? (
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
                        <p>
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
              <div className="mt-2">
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
      </div>
    </>
  );
};

export default AdminOrderPage;
