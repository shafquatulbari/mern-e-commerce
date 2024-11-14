const express = require("express");
const { getUserInfo, getUsers } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Protect the route with the protect middleware
router.get("/user-info", protect, getUserInfo);
//get all users
router.get("/", protect, admin, getUsers);

module.exports = router;
