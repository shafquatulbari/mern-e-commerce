const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");

// Get all chats (Admins can access all)
const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find().populate("customer", "username email");
  res.json(chats);
});

// Get chat by customer ID
const getChatByCustomerId = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ customer: req.params.customerId }).populate(
    "messages.sender",
    "username email"
  );
  if (chat) {
    res.json(chat);
  } else {
    res.status(404);
    throw new Error("Chat not found for this customer");
  }
});

// Start a new chat or get an existing one
const startChat = asyncHandler(async (req, res) => {
  const { customerId } = req.body;

  // Check if chat already exists
  let chat = await Chat.findOne({ customer: customerId });
  if (!chat) {
    chat = await Chat.create({ customer: customerId });
  }

  res.json(chat);
});

// Add a message to a chat
const addMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;

  const chat = await Chat.findById(chatId);
  if (chat) {
    const message = {
      sender: req.user._id,
      content,
    };
    chat.messages.push(message);
    await chat.save();
    res.json(chat);
  } else {
    res.status(404);
    throw new Error("Chat not found");
  }
});
