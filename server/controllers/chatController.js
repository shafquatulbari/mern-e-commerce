const Chat = require("../models/Chat");

// Get all chats for admins
const getAllChats = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    const chats = await Chat.find()
      .populate("users", "username email")
      .populate("messages.sender", "username email");

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching all chats:", error.message);
    res
      .status(500)
      .json({ message: "Failed to retrieve chats", error: error.message });
  }
};

// Get a specific chat by ID for both admin and customer
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
      .populate("users", "username email")
      .populate("messages.sender", "username email");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Ensure the user is either an admin or part of the chat
    if (
      !req.user.isAdmin &&
      !chat.users.some((user) => String(user) === String(req.user._id))
    ) {
      return res.status(403).json({ message: "Access denied to this chat" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat by ID:", error.message);
    res
      .status(500)
      .json({ message: "Failed to retrieve chat", error: error.message });
  }
};

// Customer or Admin initiates a chat
const initiateChat = async (req, res) => {
  try {
    const { customerId } = req.body;
    const adminId = req.user.isAdmin ? req.user._id : null;

    // Log customerId for debugging
    console.log("Customer ID received:", customerId);

    // Validate customerId
    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: "Valid Customer ID is required" });
    }

    // Check for an existing chat
    const existingChat = await Chat.findOne({
      users: customerId,
      ...(adminId && { admin: adminId }),
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create a new chat
    const chat = new Chat({
      users: [customerId],
      admin: adminId || "60c3e3b3b8b4e00015f6d4c4", // Ensure valid ObjectId
      messages: [],
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error initiating chat:", error.message);
    res
      .status(500)
      .json({ message: "Failed to initiate chat", error: error.message });
  }
};

// Save a message to a chat
const sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, text } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Ensure the user is authorized
    if (
      !req.user.isAdmin &&
      !chat.users.some((user) => String(user) === String(req.user._id))
    ) {
      return res.status(403).json({ message: "Access denied to this chat" });
    }

    const message = { sender: senderId, text };
    chat.messages.push(message);

    await chat.save();
    res.status(201).json({ message: "Message saved", chat });
  } catch (error) {
    console.error("Error saving message:", error.message);
    res
      .status(500)
      .json({ message: "Failed to save message", error: error.message });
  }
};

module.exports = {
  getAllChats,
  getChatById,
  initiateChat,
  sendMessage,
};
