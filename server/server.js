const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const manufacturerRoutes = require("./routes/manufacturerRoutes");
const cartRoutes = require("./routes/cartRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust based on your frontend
    methods: ["GET", "POST"],
  },
});

// Enable CORS
app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/chats", chatRoutes);

// Socket.IO Logic
const activeUsers = new Map(); // Track connected users

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining
  socket.on("joinChat", ({ userId, chatId }) => {
    activeUsers.set(userId, socket.id);
    socket.join(chatId);
    console.log(`User ${userId} joined chat room: ${chatId}`);
  });

  // Handle sending messages
  socket.on("sendMessage", ({ chatId, senderId, message }) => {
    io.to(chatId).emit("receiveMessage", { senderId, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    activeUsers.forEach((value, key) => {
      if (value === socket.id) activeUsers.delete(key);
    });
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("Server running on port 4000"));
