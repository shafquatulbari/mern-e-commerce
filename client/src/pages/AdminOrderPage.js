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
      <div className="p-4">
        <BackButton />
        <h2 className="text-2xl font-bold mb-4">All User Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 mb-4 rounded shadow-md bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">
                Order ID: {order._id}
              </h3>
              <p>Status: {order.status}</p>
              <p>Total Amount: ${order.totalAmount}</p>
              <div className="mt-2">
                <h4 className="font-semibold">Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.product._id}>
                      {item.product.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold">Shipping Address:</h4>
                <p>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
              <div className="mt-2">
                <label htmlFor="status" className="font-semibold">
                  Update Status:
                </label>
                <select
                  id="status"
                  value={order.status}
                  onChange={(e) =>
                    handleUpdateStatus(order._id, e.target.value)
                  }
                  className="ml-2 p-2 border rounded"
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
