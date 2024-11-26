const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const dotenv = require("dotenv");
dotenv.config();

const SHARED_ADMIN_ID =
  process.env.SHARED_ADMIN_ID || "672492e7112262789946add2";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next(); // move on to the next middleware if the token is valid
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

// Shared admin ID for chat messages
const useSharedAdminId = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    req.user._id = SHARED_ADMIN_ID; // Replace admin's ID with shared admin ID
  }
  next();
};

module.exports = { protect, admin, useSharedAdminId };
