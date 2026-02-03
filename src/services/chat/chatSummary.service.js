import ChatMessage from "../../models/chat/chatMessage.model.js";
import ChatRoom from "../../models/chat/chatRoom.model.js";

export const getRoomSummary = async (roomId) => {
  const room = await ChatRoom.findById(roomId).lean();
  if (!room) throw new Error("Room not found");

  const messages = await ChatMessage.find({ roomId })
    .sort({ createdAt: -1 }) // latest first
    .lean();

  const statusTimeline = {};

  for (const msg of messages) {
    // 🔥 IMPORTANT FIX
    const statusKey = msg.statusAtThatTime || room.status;

    // ⛔ safety check (extra protection)
    if (!statusKey) continue;

    if (!statusTimeline[statusKey]) {
      statusTimeline[statusKey] = {
        lastMessage:
          msg.message ||
          (msg.messageType === "IMAGE"
            ? "📷 Image"
            : msg.messageType === "FILE"
            ? "📎 File"
            : ""),
        senderRole: msg.senderRole,
        time: msg.createdAt,
      };
    }
  }

  return {
    roomId,
    currentStatus: room.status,
    statusTimeline,
  };
};
