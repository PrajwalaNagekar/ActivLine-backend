// src/services/chat/chat.service.js

import * as ChatRoomRepo from "../../repositories/chat/chatRoom.repository.js";
import * as ChatMsgRepo from "../../repositories/chat/chatMessage.repository.js";
import { createActivityLog } from "../ActivityLog/activityLog.service.js";
import ApiError from "../../utils/ApiError.js";

/**
 * ===============================
 * ADMIN → FETCH ALL ROOMS
 * ===============================
 */


export const getAllRooms = async ({ status }) => {
  const filter = {};

  // ✅ Apply filter ONLY when valid
  if (status && ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) {
    filter.status = status;
  }

  return ChatRoomRepo.getAll(filter);
};


/**
 * ===============================
 * CUSTOMER → OPEN CHAT
 * ===============================
 */
export const openChatIfNotExists = async (req) => {
  const customerId = req.user._id;
  const { message } = req.body;
  let room = await ChatRoomRepo.findByCustomer(customerId);

  if (!room) {
    room = await ChatRoomRepo.createRoom({
      customer: customerId,
      status: "OPEN",
    });

    await createActivityLog({
      req,
      action: "CREATE",
      module: "TICKET",
      description: "Customer created a support ticket",
      targetId: room._id,
    });
  }

  if (message && message.trim()) {
    await ChatMsgRepo.saveMessage({
      roomId: room._id,
      senderId: customerId,
      senderModel: "Customer",
      senderRole: "CUSTOMER",
      message: message.trim(),
      messageType: "TEXT",
      statusAtThatTime: room.status,
    });

    room = await ChatRoomRepo.updateRoomLastMessage(room._id, {
      lastMessage: message.trim(),
      lastMessageAt: new Date(),
    });
  }

  return room;
};

/**
 * ===============================
 * ADMIN → ASSIGN STAFF
 * ===============================
 */
export const assignStaffToRoom = async (roomId, staffId) => {
  const room = await ChatRoomRepo.assignStaff(roomId, staffId);

  if (!room) {
    throw new ApiError(404, "Chat room not found");
  }

  return room;
};

/**
 * ===============================
 * FETCH CHAT MESSAGES
 * (Admin / Staff / Customer)
 * ===============================
 */
export const getMessagesByRoom = async (roomId) => {
  return ChatMsgRepo.getMessagesByRoom(roomId);
};

/**
 * ===============================
 * CHAT PERMISSION CHECK (CORE)
 * ===============================
 *
 * RULES:
 * - CLOSED room → nobody allowed
 * - CUSTOMER → always allowed
 * - ADMIN → always allowed
 * - ADMIN_STAFF → only if assigned
 */
export const canUserSendMessage = async ({
  roomId,
  senderRole,
  senderId,
}) => {
  const room = await ChatRoomRepo.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Chat room not found");
  }

  // 🚫 Closed room
  if (room.status === "CLOSED") {
    throw new ApiError(403, "Chat is closed");
  }

  // ✅ Customer always allowed
  if (senderRole === "CUSTOMER") {
    return room;
  }

  // ✅ Admin always allowed (NO assignedStaff check)
  if (senderRole === "ADMIN" || senderRole === "SUPER_ADMIN") {
    return room;
  }

  // ✅ Admin staff only if assigned
  if (senderRole === "ADMIN_STAFF") {
    if (!room.assignedStaff) {
      throw new ApiError(403, "Staff not assigned to this chat");
    }

    const assignedStaffId = room.assignedStaff._id
      ? room.assignedStaff._id.toString()
      : room.assignedStaff.toString();

    if (assignedStaffId === senderId.toString()) {
      return room;
    }
  }

  // ❌ Everything else blocked
  throw new ApiError(403, "You cannot send message in this chat");
};
/**
 * ===============================
 * ADMIN STAFF → FETCH ASSIGNED ROOMS
 * ===============================
 */
export const getRoomsForStaff = async (staffId) => {
  return ChatRoomRepo.findByAssignedStaff(staffId);
};
export const getAssignedRoomsForStaff = async (staffId) => {
  return ChatRoomRepo.getAssignedRoomsForStaff(staffId);
};

export const updateTicketStatus = async (req, roomId, newStatus) => {
  const room = await ChatRoomRepo.findById(roomId);
  if (!room) throw new ApiError(404, "Ticket not found");

  const userRole = req.user.role;
  const currentStatus = room.status;

  // 🔐 STATUS TRANSITION RULES
  const allowedTransitions = {
    OPEN: ["IN_PROGRESS", "RESOLVED","CLOSED","OPEN"],
    ASSIGNED: ["IN_PROGRESS", "RESOLVED","CLOSED","OPEN"],
    IN_PROGRESS: ["RESOLVED","CLOSED","IN_PROGRESS"],
    RESOLVED: ["CLOSED", "OPEN","IN_PROGRESS","RESOLVED"], // reopen allowed
    CLOSED: ["CLOSED"],
  };

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new ApiError(
      400,
      `Invalid status change from ${currentStatus} to ${newStatus}`
    );
  }

  // 🔐 RBAC
  if (
    ["IN_PROGRESS", "RESOLVED", "CLOSED"].includes(newStatus) &&
    !["ADMIN", "SUPER_ADMIN", "ADMIN_STAFF"].includes(userRole)
  ) {
    throw new ApiError(403, "You are not allowed to update ticket status");
  }

  const updatedRoom = await ChatRoomRepo.updateStatus(roomId, newStatus);
await ChatMsgRepo.saveMessage({
  roomId: roomId,
  senderId: req.user._id,
  senderModel: "Admin",
  senderRole: req.user.role,
  message: `Status changed to ${newStatus}`,
  messageType: "TEXT",
  statusAtThatTime: newStatus,
});

  // await createActivityLog({
  //   req,
  //   action: "UPDATE",
  //   module: "TICKET",
  //   description: `Updated ticket status to ${newStatus}`,
  //   targetId: updatedRoom._id,
  // });

  return updatedRoom;
};
