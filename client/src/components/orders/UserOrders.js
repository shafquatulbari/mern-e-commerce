import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      // Update the order list after cancellation
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      alert("Order canceled successfully.");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="p-4">
        <BackButton />
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders.</p>
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
              {/* Cancel Order Button */}
              {order.status === "On-Delivery" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                  Cancel Order
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
