import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10 px-5">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-5 md:mb-0">
          <h1 className="text-2xl font-semibold">PharmaSphere</h1>
          <p className="mt-2 text-sm">
            Your reliable source for quality pharmaceutical products.
          </p>
        </div>

        <div className="flex space-x-4">
          <Link
            to="/homepage"
            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </Link>
          <Link
            to="/homepage"
            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
            aria-label="Instagram"
          >
            <FaInstagram />
          </Link>
          <Link
            to="/homepage"
            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
            aria-label="Twitter"
          >
            <FaTwitter />
          </Link>
          <Link
            to="/homepage"
            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} PharmaSphere. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
