const express = require("express");
const { getUserInfo } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Protect the route with the protect middleware
router.get("/user-info", protect, getUserInfo);

module.exports = router;
