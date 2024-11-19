import React, { useState } from "react";

const AdminChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // Sample Users
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Brown", email: "bob@example.com" },
  ];

  const selectUser = (user) => {
    setSelectedUser(user.id);
    setUserDetails(user);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add admin message to chat
    setMessages((prev) => [...prev, { sender: "admin", text: inputValue }]);

    // Clear input field
    setInputValue("");

    // Simulate user response after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: "Thanks for your response!" },
      ]);
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: User List */}
      <div className="w-1/4 bg-gray-100 border-r p-4">
        <h3 className="text-lg font-semibold mb-4">Users</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => selectUser(user)}
              className={`p-2 rounded-md cursor-pointer ${
                selectedUser === user.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Section: Chat Interface */}
      <div className="w-2/4 flex flex-col bg-white border-r">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            Chatting with {userDetails?.name || "Select a user"}
          </h3>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-lg p-2 rounded-md ${
                message.sender === "admin"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-100 self-start"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        {selectedUser && (
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

      {/* Right Section: User Info */}
      <div className="w-1/4 bg-gray-50 p-4">
        <h3 className="text-lg font-semibold mb-4">User Information</h3>
        {userDetails ? (
          <div>
            <p>
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
          </div>
        ) : (
          <p>Select a user to see their details.</p>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
