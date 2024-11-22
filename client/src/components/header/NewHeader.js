import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaBoxOpen,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import CartModal from "../cart/CartModal";
import { AuthContext } from "../../context/AuthContext";
import pha from "../image/pha.webp";

const NewHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showCartModal, setShowCartModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleCartModal = () => setShowCartModal((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  const handleSearch = () => {
    toggleSearch();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className="bg-white p-4 border-b-2 sticky top-0 z-10 border-black drop-shadow-xl">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/homepage" className="text-2xl font-bold">
            <img src={pha} alt="PharmaSphere" className="max-h-12" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {[
              { to: "/homepage", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/categories", label: "Categories" },
              { to: "/manufacturers", label: "Manufacturers" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `hover:text-gray-500 ${
                    isActive ? "underline underline-offset-8" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {user && user.isAdmin && (
              <>
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
                <NavLink
                  to="/admin/chatbar"
                  className={({ isActive }) =>
                    `hover:text-gray-500 ${
                      isActive ? "underline underline-offset-8" : ""
                    }`
                  }
                >
                  Chat
                </NavLink>
              </>
            )}
            {user && !user.isAdmin && (
              <>
                <NavLink
                  to="/prescription"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `hover:text-gray-500 ${
                      isActive ? "underline underline-offset-8" : ""
                    }`
                  }
                >
                  Prescription
                </NavLink>
                <button
                  onClick={toggleCartModal}
                  className="flex items-center text-gray-800"
                >
                  <FaShoppingCart className="mr-2" /> Cart
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="flex items-center text-gray-800"
                >
                  <FaBoxOpen className="mr-2" /> Orders
                </button>
              </>
            )}
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="flex items-center mb-4 md:mb-0 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search for a product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 bg-white flex-grow text-gray-700 outline-none placeholder-gray-500 focus:ring-2 focus:bg-gray-100"
              />
              <button
                onClick={handleSearch}
                className="text-white px-4 py-2 flex items-center justify-center hover:bg-gray-700"
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
            <button
              onClick={toggleDropdown}
              className="flex items-center text-gray-800"
            >
              <FaUserCircle className="text-3xl mr-2" />
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
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/categories", label: "Categories" },
              { to: "/manufacturers", label: "Manufacturers" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-gray-500"
              >
                {label}
              </NavLink>
            ))}
            {user && user.isAdmin && (
              <NavLink
                to="/admin/orders"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `hover:text-gray-500 ${
                    isActive ? "underline underline-offset-8" : ""
                  }`
                }
              >
                All User Orders
              </NavLink>
            )}
            {user && !user.isAdmin && (
              <>
                <NavLink
                  to="/prescription"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `hover:text-gray-500 ${
                      isActive ? "underline underline-offset-8" : ""
                    }`
                  }
                >
                  Prescription
                </NavLink>
                <button
                  onClick={toggleCartModal}
                  className="flex items-center text-gray-800"
                >
                  <FaShoppingCart className="mr-2" /> Cart
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="flex items-center text-gray-800"
                >
                  <FaBoxOpen className="mr-2" /> Orders
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Cart Modal */}
      {showCartModal && <CartModal closeModal={toggleCartModal} />}
    </>
  );
};

export default NewHeader;
