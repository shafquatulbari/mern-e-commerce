import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import CartModal from "../cart/CartModal";

const Header = () => {
  const { user, logout } = useContext(AuthContext); // Access the user from AuthContext
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false); // State for cart modal visibility

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCartModal = () => {
    setShowCartModal(!showCartModal);
  };

  return (
    <div className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">PillPal</h1>
      <div className="flex items-center space-x-4">
        {/* Conditionally render the cart icon and modal for non-admin users */}
        {user && !user.isAdmin && (
          <>
            <button
              className="bg-blue-500 p-2 rounded text-white"
              onClick={toggleCartModal}
            >
              Cart
            </button>
            {showCartModal && <CartModal />}{" "}
            {/* Display CartModal if state is true */}
          </>
        )}
        <button
          className="bg-red-500 p-2 rounded text-white"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
