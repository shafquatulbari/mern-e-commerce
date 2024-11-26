const ChatMessage = require("../models/Chat");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const SHARED_ADMIN_ID =
  process.env.SHARED_ADMIN_ID || "672492e7112262789946add2";

// Get all chats (admin access)
const getAllChats = async (req, res) => {
  try {
    const chats = await ChatMessage.aggregate([
      {
        $group: {
          _id: { sender: "$sender", receiver: "$receiver" },
          lastMessage: { $last: "$message" },
          lastMessageAt: { $last: "$createdAt" },
        },
      },
    ]);

    const populatedChats = await ChatMessage.populate(chats, [
      { path: "_id.sender", select: "username email", model: "User" },
      { path: "_id.receiver", select: "username email", model: "User" },
    ]);

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
};

//Fetch all messages between a customer and an admin
const getMessagesBetweenCustomerAndAdmin = async (req, res) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: customerId, receiver: SHARED_ADMIN_ID },
        { sender: SHARED_ADMIN_ID, receiver: customerId },
      ],
    })
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ message: error.message });
  }
};

// Send a chat message
const sendChatMessage = async (req, res) => {
  const { receiver, message } = req.body;

  if (!receiver || !message) {
    return res
      .status(400)
      .json({ message: "Receiver and message are required" });
  }

  const chatMessage = new ChatMessage({
    sender: req.user._id, // Shared admin ID if admin, else the user's ID
    receiver,
    message,
    isAdmin: req.user.isAdmin || false,
  });

  try {
    const savedMessage = await chatMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllChats,
  getMessagesBetweenCustomerAndAdmin,
  sendChatMessage,
};
