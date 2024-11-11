// context/CartContext.js
import React, { createContext, useState } from "react";
import api from "../services/api"; // Import your API service

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to add an item to the cart
  const addItem = async (productId, quantity = 1) => {
    try {
      const response = await api.post("/cart/add-to-cart", {
        productId,
        quantity,
      });
      const { product, quantity: addedQuantity } = response.data;

      // Update cartItems state
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === productId);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + addedQuantity }
              : item
          );
        } else {
          return [
            ...prevItems,
            { id: productId, name: product.name, quantity: addedQuantity },
          ];
        }
      });

      // Update total amount (assuming product price is available in product object)
      setTotalAmount((prevTotal) => prevTotal + product.price * addedQuantity);
    } catch (error) {
      console.error("Error adding item to cart:", error);
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
    <CartContext.Provider value={{ cartItems, addItem, checkout, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
