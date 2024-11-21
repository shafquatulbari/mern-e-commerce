const express = require("express");
const ChatMessage = require("../models/Chat");
const { protect, admin } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

// Get all chats (admin access)
router.get("/", protect, admin, async (req, res) => {
  try {
    const chats = await ChatMessage.aggregate([
      {
        $group: {
          _id: "$sender", // Group by sender (customer)
          lastMessage: { $last: "$message" }, // Get the latest message
          lastMessageAt: { $last: "$createdAt" }, // Timestamp of the latest message
        },
      },
    ]);

    // Populate the sender field with user details
    const populatedChats = await ChatMessage.populate(chats, {
      path: "_id", // Populate the `sender` field
      select: "username email",
      model: "User",
    });

    // Transform the response to include user details under a `sender` key
    const chatsWithSender = populatedChats.map((chat) => ({
      ...chat,
      sender: chat._id, // Add sender info
    }));

    res.json(chatsWithSender);
  } catch (error) {
    console.error("Error fetching all chats for admin:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get chats for a specific customer
router.get("/:customerId", protect, async (req, res) => {
  const { customerId } = req.params;
  console.log("customerId", customerId);

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  try {
    const chats = await ChatMessage.find({ sender: customerId })
      .populate("sender", "username email")
      .sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats for customer:", error);
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
