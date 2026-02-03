import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ChatRoom from "../models/chat/chatRoom.model.js";

import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import ChatMessage from "../models/chat/chatMessage.model.js";
import { canUserSendMessage } from "../services/chat/chat.service.js";
// import fs from "fs";
// import path from "path";

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
  transports: ["websocket"],
  maxHttpBufferSize: 20 * 1024 * 1024, // 🔥 20MB REQUIRED
});

  /* ===============================
     🔐 SOCKET JWT AUTH (MANDATORY)
     =============================== */
  io.use((socket, next) => {
    try {
      let token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
        socket.handshake.query?.token;

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



socket.on("send-message", async ({ roomId, message = "", attachments = [] }) => {
  try {
    if (!roomId) return;
    if (!message.trim() && attachments.length === 0) return;

    const room = await ChatRoom.findById(roomId).select("status");
    if (!room) throw new Error("Chat room not found");

    const uploadedAttachments = [];

    for (const file of attachments) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("Received empty file buffer");
      }

      const uploaded = await uploadToCloudinary({
  buffer: Buffer.from(file.buffer),          // ← remove Uint8Array wrapper
  mimetype: file.type || "application/pdf",  // ← fallback is good
  originalname: file.name,
});

      uploadedAttachments.push({
        name: file.name,
        url: uploaded.secure_url,
        size: uploaded.bytes,
        mimeType: file.type,
        extension: file.name.split(".").pop().toLowerCase(),
        type: file.type.startsWith("image") ? "image" : "file",
      });
    }

    const msg = await ChatMessage.create({
      roomId,
      senderId: socket.user._id,
      senderRole: socket.user.role,
      senderModel: socket.user.role === "CUSTOMER" ? "Customer" : "Admin",
      message,
      statusAtThatTime: room.status,
      messageType: uploadedAttachments.length
        ? uploadedAttachments.some(f => f.type === "image")
          ? "IMAGE"
          : "FILE"
        : "TEXT",
      attachments: uploadedAttachments,
      statusAtThatTime: room.status,
    });

    io.to(roomId).emit("new-message", msg);

  } catch (err) {
    console.error("❌ Socket Send Message Error:", err);
    socket.emit("send-error", { message: err.message });
  }
  await ChatRoom.findByIdAndUpdate(roomId, {
  lastMessage: message
    ? message
    : attachments.length > 0
      ? attachments[0].type === "image"
        ? "📷 Image"
        : "📎 File"
      : "",
  lastMessageAt: new Date(),
});

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
