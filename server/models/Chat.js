const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User schema
      required: true,
    },
    receiver: {
      type: String, // "admin" for admin messages, or the specific admin's ID if required
      required: true,
      default: "admin",
    },
    message: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Whether the sender is an admin
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
