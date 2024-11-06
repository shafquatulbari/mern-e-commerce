import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/"); // Navigate to login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <button
        onClick={handleGoToLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Login
      </button>
    </div>
  );
};

export default NotFound;
