import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await api.get("user/user-info/");
      setUser({
        id: response.data._id,
        username: response.data.username,
        isAdmin: response.data.isAdmin,
      });
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setUser(null); // Set user to null if fetching fails
    }
  };

  // Check for token and fetch user info on app load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserInfo();
    }
  }, []);

  const login = async (userData) => {
    try {
      const response = await api.get("user/user-info/");
      setUser({
        username: response.data.username,
        isAdmin: response.data.isAdmin,
      });
    } catch (err) {
      console.error("Failed to fetch user info after login:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
