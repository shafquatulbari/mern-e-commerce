import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const socket = io("http://localhost:4000"); // Backend URL

const AdminChatPage = () => {
  const { user } = useContext(AuthContext); // Get admin details from AuthContext
  const [chats, setChats] = useState([]); // All chats for the admin
  const [selectedChat, setSelectedChat] = useState(null); // Current selected chat
  const [messages, setMessages] = useState([]); // Messages for the selected chat
  const [inputValue, setInputValue] = useState(""); // New message input
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      if (message.chatId === selectedChat?._id) {
        // Update messages for the selected chat
        setMessages((prev) => [...prev, message]);
      } else {
        // Update chat list to reflect new messages
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === message.chatId
              ? { ...chat, lastMessage: message.text }
              : chat
          )
        );
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedChat]);

  // Fetch all chats
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/chats");
      setChats(response.data);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for the selected chat
  const selectChat = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await api.get(`/chats/${chat._id}`);
      setMessages(response.data.messages);
      socket.emit("joinChat", { chatId: chat._id }); // Join the selected chat
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Send a new message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedChat) return;

    const message = { senderId: user?.id || "adminId", text: inputValue }; // Dynamic admin ID

    try {
      const response = await api.post(
        `/chats/${selectedChat._id}/message`,
        message
      );
      if (response.status === 201) {
        socket.emit("sendMessage", { chatId: selectedChat._id, ...message });
        setMessages((prev) => [...prev, response.data.message]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
                <p>{chat.users[0]?.username}</p>
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
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-lg p-2 rounded-md ${
                message.senderId === user?.id
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-100 self-start"
              }`}
            >
              {message.text}
            </div>
          ))}
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
              <strong>Customer:</strong> {selectedChat.users[0]?.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedChat.users[0]?.email}
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
