const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User schema
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId, // Reference to admin or user
      ref: "User", // Reference to the User schema
      required: true,
    },
    message: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Whether the sender is an admin
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
