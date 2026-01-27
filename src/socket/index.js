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
      try {
        // 🛡️ STRICT PAYLOAD VALIDATION
        if (
          typeof data !== "object" ||
          !data.roomId ||
          typeof data.message !== "string" ||
          !data.message.trim()
        ) {
          console.warn("⚠️ Invalid socket payload:", data);
          return;
        }

        const { roomId, message } = data;

        // 🔐 ALWAYS TRUST JWT — NEVER CLIENT
        const senderId = socket.user._id;
        const senderRole = socket.user.role;

        // 🔒 PERMISSION CHECK
        await canUserSendMessage({
          roomId,
          senderId,
          senderRole,
        });

        const senderModel = senderRole === "CUSTOMER" ? "Customer" : "Admin";

        // 💾 SAVE TO DB
        const savedMessage = await ChatMessage.create({
          roomId,
          senderId,
          senderRole,
          message,
          senderModel,
        });

const populatedMessage = await ChatMessage
  .findById(savedMessage._id)
  .populate("senderId", "fullName email role");

io.to(roomId).emit("new-message", populatedMessage);


      } catch (err) {
        console.error("❌ MESSAGE SAVE FAILED:", err.message);
        socket.emit("error-message", { message: err.message });
      }
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
