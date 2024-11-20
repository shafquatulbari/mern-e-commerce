const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllChats,
  getChatById,
  initiateChat,
} = require("../controllers/chatController");

const router = express.Router();

// Get all chats (Admin)
router.get("/", protect, admin, getAllChats);

// Get a specific chat
router.get("/:chatId", protect, getChatById);

// Initiate a new chat
router.post("/", protect, initiateChat);

module.exports = router;

