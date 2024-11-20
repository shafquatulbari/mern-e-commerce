import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Replace with your backend URL

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Chat ID and Customer ID (replace with dynamic values from your app)
  const chatId = "exampleChatId";
  const customerId = "exampleCustomerId";

  useEffect(() => {
    // Join the chat room
    socket.emit("joinChat", { userId: customerId, chatId });

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId, customerId]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const message = {
      chatId,
      senderId: customerId,
      text: inputValue,
    };

    // Emit the message to the server
    socket.emit("sendMessage", message);

    // Update local chat history
    setMessages((prev) => [
      ...prev,
      { senderId: customerId, text: inputValue },
    ]);
    setInputValue("");
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {/* Chat Interface */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-semibold">Support Chat</h3>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
          </div>
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto space-y-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md max-w-max ${
                    message.senderId === customerId
                      ? "bg-blue-500 text-white place-items-end"
                      : "bg-gray-100 text-gray-800 place-items-start"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            {/* Input Section */}
            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
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
          </div>
        </div>
      )}

      {/* Chat Icon */}
      <button
        onClick={toggleChat}
        className="bg-blue-500 text-white p-4 mt-10 rounded-full shadow-lg hover:bg-blue-600"
      >
        💬
      </button>
    </div>
  );
};

export default SupportChat;
