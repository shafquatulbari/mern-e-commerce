import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaBoxOpen,
  FaUserCircle,
  FaSearch,
  FaTasks,
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import CartModal from "../cart/CartModal";
import { AuthContext } from "../../context/AuthContext";
import pha from "../image/pha.webp";

const NewHeader = () => {
  const { user, logout } = useContext(AuthContext);
  //console.log(user.username);
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle search bar visibility
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCartModal = () => setShowCartModal((prevState) => !prevState);
  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);
  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);
  const toggleSearch = () => setIsSearchOpen((prevState) => !prevState); // Toggle search bar

  const handleSearch = () => {
    toggleSearch();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white p-4 relative border-b-2 border-black">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/homepage" className="text-2xl font-bold">
          <img src={pha} alt="PharmaSphere" className="w-full max-h-10" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <NavLink
            to="/homepage"
            className={({ isActive }) =>
              `hover:text-gray-500 ${
                isActive ? "underline underline-offset-8" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `hover:text-gray-500 ${
                isActive ? "underline underline-offset-8" : ""
              }`
            }
          >
            All Products
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `hover:text-gray-500 ${
                isActive ? "underline underline-offset-8" : ""
              }`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/manufacturers"
            className={({ isActive }) =>
              `hover:text-gray-500 ${
                isActive ? "underline underline-offset-8" : ""
              }`
            }
          >
            All Manufacturers
          </NavLink>
          {user && user.isAdmin && (
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `hover:text-gray-500 ${
                  isActive ? "underline underline-offset-8" : ""
                }`
              }
            >
              All User Orders
            </NavLink>
          )}
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div
            className={`flex items-center mb-4 md:mb-0 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden`}
          >
            <input
              type="text"
              placeholder="Search for a product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 bg-white flex-grow text-gray-700 outline-none placeholder-gray-500 focus:ring-2 focus:bg-gray-100"
            />
            <button
              onClick={handleSearch}
              className=" text-white px-4 py-2 flex items-center justify-center hover:bg-gray-700"
            >
              <FaSearch />
            </button>
          </div>
        )}

        {/* Right-Side Icons */}
        <div className="flex items-center space-x-4">
          {!isSearchOpen && (
            <button onClick={toggleSearch} className="text-gray-800">
              <FaSearch />
            </button>
          )}

          {user && !user.isAdmin && (
            <>
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
            </>
          )}

          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-800"
          >
            <FaUserCircle className="text-3xl mr-2" />{" "}
            {user ? user.username : "GUEST"}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-2 text-red-500"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
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
          {user && user.isAdmin && (
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `hover:text-gray-500 ${
                  isActive ? "underline underline-offset-8" : ""
                }`
              }
            >
              All User Orders
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default NewHeader;
