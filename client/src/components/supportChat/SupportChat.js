import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../../services/api";

// Initialize Socket.IO
const socket = io("http://localhost:4000"); // Replace with your backend URL

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const userId = localStorage.getItem("user_id"); // Get user ID from localStorage

  // Fetch previous chat messages
  const fetchChatMessages = async () => {
    if (!userId) return; // Exit early if user ID is not available

    try {
      const response = await api.get(`chats/${userId}`);
      if (response.data && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.warn("Invalid response format:", response.data); // Debugging
        setMessages([]); // Fallback
      }
    } catch (err) {
      console.error("Failed to fetch chat messages:", err);
    }
  };

  // Send a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !userId) return;

    const messageData = {
      sender: userId, // Current user ID
      receiver: "672492e7112262789946add2", // Admin user ID
      message: inputValue,
      isAdmin: false, // User is not an admin
    };

    try {
      const response = await api.post("chats/", messageData);
      setMessages((prev) => [...prev, response.data]);
      socket.emit("sendMessage", response.data); // Emit the new message
      setInputValue("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Listen for real-time messages
  useEffect(() => {
    if (!userId) return; // Exit early if user ID is not available

    socket.on("receiveMessage", (data) => {
      if (data.sender === userId || data.receiver === "admin") {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [userId]);

  // Load previous messages when chat opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchChatMessages();
    }
  }, [isOpen, userId]);

  if (!userId) {
    return null; // Render nothing if user ID is not available
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-semibold">Support Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
          </div>

          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-grow overflow-y-auto flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start"
                  style={{
                    alignItems: message.isAdmin ? "flex-start" : "flex-end", // Align admin left, customer right
                  }}
                >
                  {/* Message box */}
                  <div
                    className={`p-2 rounded-md max-w-max ${
                      message.isAdmin
                        ? "bg-gray-100 text-black" // Admin messages
                        : "bg-blue-500 text-white" // Customer messages
                    }`}
                  >
                    <p>{message.message || "No content"}</p>
                  </div>
                  {/* Timestamp */}
                  <p
                    className={`text-xs ${
                      message.isAdmin ? "text-gray-500" : "text-gray-700"
                    } mt-1`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || "Time not available"}
                  </p>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white p-4 mt-10 rounded-full shadow-lg hover:bg-blue-600"
      >
        💬
      </button>
    </div>
  );
};

export default SupportChat;
