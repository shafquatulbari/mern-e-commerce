import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSignOutAlt, FaBoxOpen } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import CartModal from "../cart/CartModal";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCartModal = () => {
    setShowCartModal((prevState) => !prevState);
  };

  const goToOrders = () => {
    navigate("/orders");
  };

  return (
    <div className=" relative w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">PillPal</h1>
      <div className="flex items-center space-x-4">
        {user && !user.isAdmin && (
          <>
            <button
              className="bg-blue-500 p-2 rounded text-white flex items-center"
              onClick={toggleCartModal}
            >
              <FaShoppingCart className="mr-2" /> Cart
            </button>
            <div className="absolute z-20">
              {showCartModal && <CartModal closeModal={toggleCartModal} />}
            </div>
            <button
              className="bg-green-500 p-2 rounded text-white flex items-center"
              onClick={goToOrders}
            >
              <FaBoxOpen className="mr-2" /> Orders
            </button>
          </>
        )}
        <button
          className="bg-red-500 p-2 rounded text-white flex items-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
