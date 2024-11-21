const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const Chat = require("./models/Chat");

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

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
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

// Socket.IO connection

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`Client ${socket.id} joined chat ${chatId}`);
  });

  socket.on("sendMessage", ({ chatId, message }) => {
    console.log(`Message received in chat ${chatId}:`, message);
    io.to(chatId).emit("receiveMessage", { chatId, ...message });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("Server running on port 4000"));
