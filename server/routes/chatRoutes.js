const express = require("express");
const ChatMessage = require("../models/Chat");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all chats (admin access)
router.get("/", protect, admin, async (req, res) => {
  try {
    const chats = await ChatMessage.find().populate("sender", "username email");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chats for a specific customer
router.get("/:customerId", protect, async (req, res) => {
  try {
    const chats = await ChatMessage.find({
      sender: req.params.customerId,
    }).populate("sender", "username email");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a chat message
router.post("/", protect, async (req, res) => {
  const { receiver, message, isAdmin } = req.body;
  const chatMessage = new ChatMessage({
    sender: req.user._id,
    receiver,
    message,
    isAdmin: req.user.isAdmin || false,
  });

  try {
    const savedMessage = await chatMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
