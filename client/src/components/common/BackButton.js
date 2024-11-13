import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ to = -1, label = "Go Back" }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleGoBack}
      className="bg-gray-500 text-white px-4 py-2 rounded mb-4 flex items-center"
    >
      <FaArrowLeft className="mr-2" /> {label}
    </button>
  );
};

export default BackButton;
