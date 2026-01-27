// src/repositories/chat/chatMessage.repository.js
import ChatMessage from "../../models/chat/chatMessage.model.js";

export const saveMessage = (data) => ChatMessage.create(data);

export const getMessagesByRoom = (roomId) =>
  ChatMessage.find({ roomId })
    .sort({ createdAt: 1 })
    .populate("senderId", "fullName name email mobile role"); // 🔥 Populates sender details
