import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Replace with your backend URL

const AdminChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Fetch all chats (Admin-specific logic)
    fetch("http://localhost:4000/api/chats")
      .then((response) => response.json())
      .then((data) => setChats(data));

    socket.on("receiveMessage", (message) => {
      if (message.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedChat]);

  const selectChat = (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages || []);
    socket.emit("joinChat", { userId: "adminId", chatId: chat._id });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "" || !selectedChat) return;

    const message = {
      chatId: selectedChat._id,
      senderId: "adminId", // Replace with dynamic admin ID
      text: inputValue,
    };

    // Emit the message to the server
    socket.emit("sendMessage", message);

    // Update local chat history
    setMessages((prev) => [...prev, { senderId: "adminId", text: inputValue }]);
    setInputValue("");
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: User List */}
      <div className="w-1/4 bg-gray-100 border-r p-4">
        <h3 className="text-lg font-semibold mb-4">Active Chats</h3>
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
              {chat.users[0].username} {/* Display customer name */}
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Section: Chat Interface */}
      <div className="w-2/4 flex flex-col bg-white border-r">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            Chatting with {selectedChat?.users[0].username || "Select a chat"}
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-lg p-2 rounded-md ${
                message.senderId === "adminId"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-100 self-start"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        {selectedChat && (
          <div className="p-4 border-t flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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

      {/* Right Section: Chat Info */}
      <div className="w-1/4 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold mb-4">Chat Information</h3>
        {selectedChat ? (
          <div>
            <p>
              <strong>Customer:</strong> {selectedChat.users[0].username}
            </p>
            <p>
              <strong>Email:</strong> {selectedChat.users[0].email}
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
