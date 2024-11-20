const Chat = require("../models/Chat");

// Controller to get all chats for admin
const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate("users", "username email")
      .populate("messages.sender", "username email");
    res.status(200).json(chats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve chats", error: error.message });
  }
};

// Controller to get chat by ID
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
      .populate("users", "username email")
      .populate("messages.sender", "username email");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve chat", error: error.message });
  }
};

// Controller to initiate a chat
const initiateChat = async (req, res) => {
  try {
    const { customerId, adminId } = req.body;
    const existingChat = await Chat.findOne({
      users: { $all: [customerId, adminId] },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const chat = new Chat({ users: [customerId, adminId], messages: [] });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to initiate chat", error: error.message });
  }
};

module.exports = { getAllChats, getChatById, initiateChat };
