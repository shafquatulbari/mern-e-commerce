import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaBoxOpen,
  FaUserCircle,
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import CartModal from "../cart/CartModal";
import { AuthContext } from "../../context/AuthContext";

const NewHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCartModal = () => setShowCartModal((prevState) => !prevState);
  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);
  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);

  return (
    <nav className="bg-white p-4 relative border-b-2 border-black">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">PillPal</h1>

        <div className="hidden md:flex space-x-8">
          <NavLink
            to="/homepage"
            className={({ isActive }) =>
              `hover:text-gray-500 ${isActive ? "underline" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-gray-500 ${isActive ? "underline" : ""}`
            }
          >
            All Products
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `hover:text-gray-500 ${isActive ? "underline" : ""}`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/manufacturers"
            className={({ isActive }) =>
              `hover:text-gray-500 ${isActive ? "underline" : ""}`
            }
          >
            All Manufacturers
          </NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleCartModal}
            className="flex items-center text-gray-800"
          >
            <FaShoppingCart className="mr-2" /> Cart
          </button>
          {showCartModal && (
            <div className="absolute top-full right-0 mt-2">
              <CartModal closeModal={toggleCartModal} />
            </div>
          )}
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center text-gray-800"
          >
            <FaBoxOpen className="mr-2" /> Orders
          </button>
          <button onClick={toggleDropdown} className="text-gray-800">
            <FaUserCircle className="text-3xl" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <button
                onClick={handleLogout}
                className="w-full text-left p-2 text-red-500"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-800">
            <RxHamburgerMenu className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4 px-4">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-gray-500"
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-gray-500"
          >
            All Products
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-gray-500"
          >
            Categories
          </NavLink>
          <NavLink
            to="/manufacturers"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-gray-500"
          >
            All Manufacturers
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default NewHeader;
