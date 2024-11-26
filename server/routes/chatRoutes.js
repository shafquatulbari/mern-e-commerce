const express = require("express");
const {
  getAllChats,
  getMessagesBetweenCustomerAndAdmin,
  sendChatMessage,
} = require("../controllers/chatController");
const {
  protect,
  admin,
  useSharedAdminId,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all chats (admin access)
router.get("/", protect, admin, useSharedAdminId, getAllChats);

// Fetch all messages between a customer and an admin
router.get(
  "/:customerId",
  protect,
  useSharedAdminId,
  getMessagesBetweenCustomerAndAdmin
);

// Send a chat message
router.post("/", protect, useSharedAdminId, sendChatMessage);

module.exports = router;
