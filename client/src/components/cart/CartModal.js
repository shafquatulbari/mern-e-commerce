import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import PaymentForm from "../payment/PaymentForm";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

const CartModal = ({ closeModal }) => {
  const { cartItems, addItem, removeItem, totalAmount } =
    useContext(CartContext);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 md:pr-4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
            <h2 className="text-2xl font-bold mb-4 text-black">Your Cart</h2>
            {cartItems.length > 0 ? (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={item.product._id}
                    className="flex items-center justify-between"
                  >
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded-md flex items-center justify-center">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="flex-1 ml-4">
                      <p className="font-semibold text-black">
                        {item.product ? item.product.name : "Unknown Product"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Unit Price: $
                        {item.product && !isNaN(item.product.price)
                          ? item.product.price.toFixed(2)
                          : "Loading..."}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Total: $
                        {item.product && !isNaN(item.product.price)
                          ? (item.product.price * item.quantity).toFixed(2)
                          : "Loading..."}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="bg-green-500 p-2 rounded text-white hover:bg-green-600"
                        onClick={() => addItem(item.product._id)}
                      >
                        <FaPlus />
                      </button>
                      <button
                        className="bg-red-500 p-2 rounded text-white hover:bg-red-600"
                        onClick={() => removeItem(item.product._id)}
                      >
                        <FaMinus />
                      </button>
                      <button
                        className="bg-gray-500 p-2 rounded text-white hover:bg-gray-600"
                        onClick={() => removeItem(item.product._id, true)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">Your cart is empty.</p>
            )}
            {cartItems.length > 0 && (
              <div className="mt-6 text-right text-black font-bold">
                <p>Total Amount: ${totalAmount.toFixed(2)}</p>
              </div>
            )}
          </div>
          <div className="md:w-1/3 md:pl-4 pt-4 md:pt-0">
            <h3 className="text-lg font-bold mb-4 text-black">
              Shipping Payment Method
            </h3>
            <div className="mb-4">
              <label className="block mb-2 text-black">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => handlePaymentMethodChange("cash")}
                  className="mr-2"
                />
                Cash on Delivery
              </label>
              <label className="block text-black">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => handlePaymentMethodChange("card")}
                  className="mr-2"
                />
                Pay by Card
              </label>
            </div>
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
                setShippingAddress({ ...shippingAddress, city: e.target.value })
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
              className="w-full p-2 border rounded mb-4 text-black"
            />

            {paymentMethod === "card" && (
              <PaymentForm
                closeModal={closeModal}
                shippingAddress={shippingAddress}
              />
            )}
            {paymentMethod !== "card" && (
              <button
                className="bg-blue-500 w-full p-2 rounded text-white mt-4"
                type="submit"
              >
                Order Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
