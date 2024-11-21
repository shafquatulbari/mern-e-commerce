import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import io from "socket.io-client";

// Initialize Socket.IO
const socket = io("http://localhost:4000"); // Use your backend's URL

const AdminChatPage = () => {
  const { user } = useContext(AuthContext); // Get the user from context
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch active chats
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("chats/");
      if (response.data && Array.isArray(response.data)) {
        setChats(response.data);
      } else {
        console.warn("Invalid chats response:", response.data); // Debugging
        setChats([]);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for a selected chat
  const fetchMessages = async (chatId) => {
    try {
      const response = await api.get(`chats/${chatId}`);
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // Select a chat
  const selectChat = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return; // Exit if no message or user not loaded

    const messageData = {
      receiver: selectedChat?._id, // Send to the currently selected chat
      message: inputValue,
      isAdmin: true,
    };

    try {
      const response = await api.post("chats/", messageData);
      setMessages((prev) => [...prev, response.data]);
      socket.emit("sendMessage", { chatId: selectedChat._id, ...messageData });
      setInputValue("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // Real-time message handling
  useEffect(() => {
    if (!user) return; // Exit if user is not loaded

    socket.on("receiveMessage", (data) => {
      if (selectedChat && data.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedChat, user]);

  // Load chats on mount
  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  if (!user) {
    return null; // Render nothing until user is loaded
  }

  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div className="w-1/4 bg-gray-100 border-r p-4">
        <h3 className="text-lg font-semibold mb-4">Active Chats</h3>
        {isLoading ? (
          <p>Loading chats...</p>
        ) : chats.length === 0 ? (
          <p>No active chats</p>
        ) : (
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li
                key={chat._id}
                onClick={() => selectChat(chat)}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedChat?._id === chat._id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                <p>{chat.users?.[0]?.username || "Unknown User"}</p>{" "}
                {/* Check if users exists */}
                <p className="text-sm text-gray-500">
                  {chat.lastMessage || "No messages yet"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Interface */}
      <div className="w-2/4 flex flex-col bg-white border-r">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {selectedChat
              ? `Chatting with ${selectedChat.users[0]?.username}`
              : "Select a chat"}
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-lg p-2 rounded-md ${
                  message.sender === user?.id
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                {message.message}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet</p> // Show a fallback message
          )}
        </div>

        {/* Input */}
        {selectedChat && (
          <div className="p-4 border-t flex items-center">
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
        )}
      </div>

      {/* Chat Info */}
      <div className="w-1/4 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold mb-4">Chat Information</h3>
        {selectedChat ? (
          <div>
            <p>
              <strong>Customer:</strong>{" "}
              {selectedChat.users?.[0]?.username || "Unknown User"}
            </p>
            <p>
              <strong>Email:</strong> {selectedChat.users?.[0]?.email || "N/A"}
            </p>
          </div>
        ) : (
          <p>Select a chat to view details.</p>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
