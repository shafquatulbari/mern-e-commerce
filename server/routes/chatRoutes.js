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
          _id: { sender: "$sender", receiver: "$receiver" }, // Group by sender-receiver pair
          lastMessage: { $last: "$message" }, // Latest message
          lastMessageAt: { $last: "$createdAt" }, // Timestamp of the latest message
        },
      },
    ]);

    // Populate sender and receiver details
    const populatedChats = await ChatMessage.populate(chats, [
      { path: "_id.sender", select: "username email", model: "User" },
      { path: "_id.receiver", select: "username email", model: "User" },
    ]);

    // Transform the response to include user details under the appropriate key
    const chatsWithDetails = populatedChats.map((chat) => ({
      ...chat,
      sender: chat._id.sender,
      receiver: chat._id.receiver,
    }));

    res.json(chatsWithDetails);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch all messages between a customer and an admin
router.get("/:customerId", protect, async (req, res) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  try {
    const messages = await ChatMessage.find({
      $or: [{ sender: customerId }, { receiver: customerId }],
    })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: error.message });
  }
});

// Send a chat message
router.post("/", protect, async (req, res) => {
  const { receiver, message, isAdmin } = req.body;

  // Ensure receiver and message are provided
  if (!receiver || !message) {
    return res
      .status(400)
      .json({ message: "Receiver and message are required" });
  }

  const chatMessage = new ChatMessage({
    sender: req.user._id, // Admin's ID (or current user's ID)
    receiver, // The ID of the selected user (customer)
    message,
    isAdmin: req.user.isAdmin || false, // Whether the sender is an admin
  });

  try {
    const savedMessage = await chatMessage.save(); // Save the message to the database
    res.status(201).json(savedMessage); // Respond with the saved message
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
