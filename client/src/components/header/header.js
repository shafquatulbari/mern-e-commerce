import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  return (
    <div className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">PillPal</h1>
      <div className="flex items-center space-x-4">
        {user && !user.isAdmin && (
          <>
            <button
              className="bg-blue-500 p-2 rounded text-white"
              onClick={toggleCartModal}
            >
              Cart
            </button>
            {showCartModal && <CartModal closeModal={toggleCartModal} />}{" "}
            {/* Pass closeModal */}
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
