const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllChats,
  getChatById,
  initiateChat,
  sendMessage,
} = require("../controllers/chatController");

const router = express.Router();

// Admin: Get all chats
router.get("/", protect, admin, getAllChats);

// Get a specific chat by ID (admin or user)
router.get("/:chatId", protect, getChatById);

// Customer/Admin: Initiate a chat
router.post("/", protect, initiateChat);

// Save a message to a chat
router.post("/:chatId/message", protect, sendMessage);

module.exports = router;
