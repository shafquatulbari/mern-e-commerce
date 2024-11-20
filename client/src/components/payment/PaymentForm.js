import React, { useState, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CartContext } from "../../context/CartContext";
import api from "../../services/api";

const PaymentForm = ({ closeModal, shippingAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, totalAmount } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      // Create a payment intent on the backend
      const {
        data: { clientSecret },
      } = await api.post("/stripe/payment", {
        amount: totalAmount * 100, // Convert to cents
      });

      // Confirm the payment using the client secret
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error("Payment error:", result.error.message);
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // Checkout logic: Call your backend to create the order
        const items = cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        }));

        await api.post("/cart/checkout", {
          items,
          totalAmount,
          shippingAddress,
        });

        alert("Order placed successfully!");
        closeModal();
      }
    } catch (error) {
      console.error("Error during payment or checkout:", error);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border rounded mb-4" />
      <button
        className="bg-blue-500 w-full p-2 rounded text-white mt-4"
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : "Order Now"}
      </button>
    </form>
  );
};

export default PaymentForm;
