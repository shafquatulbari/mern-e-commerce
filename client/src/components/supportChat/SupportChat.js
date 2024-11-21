import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const socket = io("http://localhost:4000"); // Backend URL

const SupportChat = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chatId, setChatId] = useState(null); // Dynamic chat ID

  useEffect(() => {
    if (!user) return; // Wait for user to load

    const initiateChat = async () => {
      try {
        const response = await api.post("/chats", { customerId: user.id });
        setChatId(response.data._id);
        setMessages(response.data.messages || []);
        socket.emit("joinChat", { chatId: response.data._id }); // Join room here
      } catch (error) {
        console.error("Failed to initiate chat:", error);
      }
    };

    initiateChat();

    socket.on("receiveMessage", (message) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatId) return;

    const message = { senderId: user.id, text: inputValue };

    try {
      const response = await api.post(`/chats/${chatId}/message`, message);
      if (response.status === 201) {
        socket.emit("sendMessage", { chatId, ...message });
        setMessages((prev) => [...prev, response.data.message]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
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
                  {message.text}
                </div>
              ))}
            </div>

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
