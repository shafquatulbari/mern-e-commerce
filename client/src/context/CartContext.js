import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch the cart from the backend when the component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        setCartItems(response.data);
        calculateTotal(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  // Calculate the total amount
  const calculateTotal = (cart) => {
    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    console.log(total + "total");
    setTotalAmount(total);
  };

  // Function to add an item to the cart
  const addItem = async (productId, quantity = 1) => {
    try {
      // Prevent negative quantity from being added
      if (quantity <= 0) {
        console.warn("Quantity must be greater than zero.");
        return;
      }

      // Make the API call to add the item to the cart
      const response = await api.post("/cart", { productId, quantity });

      // Update cart items and calculate total
      setCartItems(response.data);
      calculateTotal(response.data);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // Function to remove an item from the cart
  const removeItem = async (productId, removeCompletely = false) => {
    try {
      if (removeCompletely) {
        const response = await api.delete(`/cart/${productId}`);
        setCartItems(response.data);
      } else {
        // Logic for decreasing quantity
        const item = cartItems.find((item) => item.product._id === productId);
        if (item && item.quantity > 1) {
          await addItem(productId, -1); // Decrease quantity by 1
        } else {
          const response = await api.delete(`/cart/${productId}`);
          setCartItems(response.data);
        }
      }
      calculateTotal(cartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Function to handle checkout
  const checkout = async (shippingAddress) => {
    try {
      const items = cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));
      const response = await api.post("/cart/checkout", {
        items,
        totalAmount,
        shippingAddress,
      });

      // Clear cart after successful checkout
      setCartItems([]);
      setTotalAmount(0);

      return response.data;
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, removeItem, checkout, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};
