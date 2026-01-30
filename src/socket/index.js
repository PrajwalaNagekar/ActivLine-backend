import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ChatMessage from "../models/chat/chatMessage.model.js";
import { canUserSendMessage } from "../services/chat/chat.service.js";

let io;

export const initSocket = (server) => {
  /* ===============================
     🌐 ALLOWED ORIGINS
     =============================== */
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:64255",
  ];

  if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(
      ...process.env.CORS_ORIGIN.split(",").map(o => o.trim())
    );
  }

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || origin === "null") return callback(null, true);

        if (
          allowedOrigins.includes(origin) ||
          origin.startsWith("http://localhost") ||
          origin.startsWith("http://127.0.0.1")
        ) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by Socket.IO CORS"));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"], // ⛔ NO polling (important)
  });

  /* ===============================
     🔐 SOCKET JWT AUTH (MANDATORY)
     =============================== */
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        console.error(`❌ Socket Connection Rejected: No token provided (ID: ${socket.id})`);
        return next(new Error("Socket auth token missing"));
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

      socket.user = {
        _id: decoded._id,
        role: (decoded.role || "CUSTOMER").toUpperCase(),
        email: decoded.email || null,
      };

      next();
    } catch (err) {
      console.error(`❌ Socket Connection Rejected: Invalid token (ID: ${socket.id}) - ${err.message}`);
      return next(new Error("Invalid socket token"));
    }
  });

  /* ===============================
     🔌 SOCKET CONNECTION
     =============================== */
  io.on("connection", (socket) => {
    console.log(
      "🟢 Socket connected:",
      socket.id,
      "| ROLE:",
      socket.user.role
    );

    /* -------- JOIN ROOM -------- */
    socket.on("join-room", (roomId) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log("📦 Joined room:", roomId);
    });

    /* ===============================
       💬 SEND MESSAGE (ADMIN/CUSTOMER)
       =============================== */
   socket.on("send-message", async (data) => {
  const { roomId, message = "", attachments = [] } = data;

  if (!roomId) return;
  if (!message.trim() && attachments.length === 0) return;

  const msg = await ChatMessage.create({
    roomId,
    senderId: socket.user._id,
    senderRole: socket.user.role,
    senderModel: socket.user.role === "CUSTOMER" ? "Customer" : "Admin",
    message,
    messageType: attachments.length
      ? attachments.some(a => a.type === "image") ? "IMAGE" : "FILE"
      : "TEXT",
    attachments,
  });

  const populated = await ChatMessage
    .findById(msg._id)
    .populate("senderId", "fullName role");

  io.to(roomId).emit("new-message", populated);
});


    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
