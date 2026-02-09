import ChatRoom from "../../models/chat/chatRoom.model.js";
import ChatMessage from "../../models/chat/chatMessage.model.js";
import ActivityLog from "../../models/ActivityLog/activityLog.model.js";

export const getRoomSummaryData = async (roomId) => {
  const room = await ChatRoom.findById(roomId)
    .populate("customer", "fullName email")
    .populate("assignedStaff", "name email");

  if (!room) return null;

  // last message
  const lastMessage = await ChatMessage.findOne({ roomId })
    .sort({ createdAt: -1 })
    .select("message senderRole createdAt");

  // last status change (from activity logs)
  const lastStatusLog = await ActivityLog.findOne({
    targetId: roomId,
    module: "TICKET",
    action: "UPDATE",
  }).sort({ createdAt: -1 });

  return {
    room,
    lastMessage,
    lastStatusLog,
  };
};
