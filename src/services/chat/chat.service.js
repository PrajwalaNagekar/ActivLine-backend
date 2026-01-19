// src/services/chat/chat.service.js

import * as ChatRoomRepo from "../../repositories/chat/chatRoom.repository.js";
import * as ChatMsgRepo from "../../repositories/chat/chatMessage.repository.js";
import ApiError from "../../utils/ApiError.js";

/**
 * ===============================
 * ADMIN → FETCH ALL ROOMS
 * ===============================
 */
export const getAllRooms = async () => {
  return ChatRoomRepo.getAll();
};

/**
 * ===============================
 * CUSTOMER → OPEN CHAT
 * ===============================
 */
export const openChatIfNotExists = async (customerId) => {
  let room = await ChatRoomRepo.findByCustomer(customerId);

  if (!room) {
    room = await ChatRoomRepo.createRoom({
      customer: customerId,
      status: "OPEN",
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
  if (senderRole === "ADMIN") {
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
