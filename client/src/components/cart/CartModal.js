import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import PaymentForm from "../payment/PaymentForm";

const CartModal = ({ closeModal }) => {
  const { cartItems, addItem, removeItem, totalAmount } =
    useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Your Cart</h2>
        {cartItems.length > 0 ? (
          <>
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item.product._id}
                  className="flex justify-between mb-2 text-black"
                >
                  <div>
                    {item.product.name} (x{item.quantity})
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-green-500 p-1 rounded text-white mr-2"
                      onClick={() => addItem(item.product._id)}
                    >
                      +
                    </button>
                    <button
                      className="bg-red-500 p-1 rounded text-white mr-2"
                      onClick={() => removeItem(item.product._id)}
                    >
                      -
                    </button>
                    <button
                      className="bg-gray-500 p-1 rounded text-white"
                      onClick={() => removeItem(item.product._id, true)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-black">
              <strong>Total Cost: ${totalAmount.toFixed(2)}</strong>
            </div>
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
                className="w-full p-2 border rounded mb-2 text-black"
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
                className="w-full p-2 border rounded mb-2 text-black"
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
                className="w-full p-2 border rounded mb-2 text-black"
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
                className="w-full p-2 border rounded mb-2 text-black"
              />
            </div>
            <PaymentForm
              closeModal={closeModal}
              shippingAddress={shippingAddress}
            />
          </>
        ) : (
          <p className="text-black">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default CartModal;
