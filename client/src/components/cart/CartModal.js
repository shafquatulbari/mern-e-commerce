// components/cart/CartModal.js
import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";

const CartModal = () => {
  const { cartItems, addItem, checkout, totalAmount } = useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleCheckout = async () => {
    try {
      const response = await checkout(shippingAddress);
      alert("Order placed successfully!");
      console.log("Order details:", response);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between mb-2">
                  <div>
                    {item.name} (x{item.quantity})
                  </div>
                  <div>
                    <button
                      className="bg-green-500 p-1 rounded text-white mr-2"
                      onClick={() => addItem(item.id)}
                    >
                      +
                    </button>
                    {/* Implement remove and delete logic if needed */}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <strong>Total Cost: ${totalAmount}</strong>
            </div>
            {/* Shipping Address Form */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Address"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    address: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
              />
            </div>
            <button
              className="bg-blue-500 w-full p-2 rounded text-white mt-4"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default CartModal;
