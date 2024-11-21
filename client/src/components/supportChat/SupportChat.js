import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

// Initialize Socket.IO
const socket = io("http://localhost:4000"); // Replace with your backend URL

const SupportChat = () => {
  const { user } = useContext(AuthContext); // Get the user from context
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Fetch previous chat messages
  const fetchChatMessages = async () => {
    if (!user) return;

    try {
      const response = await api.get(`chats/${user.id}`);
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
    if (!inputValue.trim() || !user) return; // Exit early if no message or user not loaded

    const messageData = {
      receiver: "admin",
      message: inputValue,
      isAdmin: false,
    };

    try {
      const response = await api.post("chats/", messageData);
      setMessages((prev) => [...prev, response.data]);
      socket.emit("sendMessage", { chatId: user.id, ...messageData });
      setInputValue("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Listen for real-time messages
  useEffect(() => {
    if (!user) return; // Exit early if user is not loaded

    socket.on("receiveMessage", (data) => {
      if (data.sender === user.id || data.receiver === "admin") {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [user]);

  // Load previous messages when chat opens
  useEffect(() => {
    if (isOpen && user) {
      fetchChatMessages();
    }
  }, [isOpen, user]);

  if (!user) {
    return null; // Render nothing until user is loaded
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
            <div className="flex-grow overflow-y-auto space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md max-w-max ${
                    message.sender === user.id
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-100 self-start"
                  }`}
                >
                  {message.message}
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
