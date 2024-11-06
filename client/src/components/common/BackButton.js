import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ to = -1, label = "Go Back" }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(to); // By default, it will go back one step in history or we can navigate(-1)
  };

  return (
    <button
      onClick={handleGoBack}
      className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
    >
      {label}
    </button>
  );
};

export default BackButton;
