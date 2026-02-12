// src/services/chat/chat.service.js

import * as ChatRoomRepo from "../../repositories/chat/chatRoom.repository.js";
import * as ChatMsgRepo from "../../repositories/chat/chatMessage.repository.js";
import ChatMessage from "../../models/chat/chatMessage.model.js";
import { createActivityLog } from "../ActivityLog/activityLog.service.js";
import ApiError from "../../utils/ApiError.js";
import crypto from "crypto";

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

  // ✅ Generate 10-digit numeric ID
  const roomId = crypto.randomInt(1000000000, 10000000000).toString();

  // ✅ ALWAYS CREATE NEW ROOM (no reuse)
  const room = await ChatRoomRepo.createRoom({
    _id: roomId,
    customer: customerId,
    status: "OPEN",
  });

  // ✅ ACTIVITY LOG
  await createActivityLog({
    req,
    action: "CREATE",
    module: "TICKET",
    description: "Customer created a new support ticket",
    targetId: room._id,
  });

  // ✅ Send default massage from SuperAdmin
  const defaultMessage = "What can I Help you";
  await ChatMsgRepo.saveMessage({
    roomId: room._id,
    senderId: "000000000000000000000000", // Placeholder ID for SuperAdmin
    senderModel: "Admin",
    senderRole: "SUPER_ADMIN",
    message: defaultMessage,
    messageType: "TEXT",
    statusAtThatTime: room.status,
  });

  await ChatRoomRepo.updateRoomLastMessage(room._id, {
    lastMessage: defaultMessage,
    lastMessageAt: new Date(),
  });

  // ✅ SAVE FIRST MESSAGE (optional)
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

    await ChatRoomRepo.updateRoomLastMessage(room._id, {
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


export const getMyChatRooms = async (customerId) => {
  const rooms = await ChatRoomRepo.findRoomsByCustomer(customerId);

  const roomsWithData = await Promise.all(
    rooms.map(async (room) => {
      const roomData = room.toObject ? room.toObject() : room;

      const firstMsg = await ChatMessage.findOne({
        roomId: room._id,
        senderRole: "CUSTOMER",
      })
        .sort({ createdAt: 1 })
        .select("message")
        .lean();

      return {
        ...roomData,
        Title: firstMsg?.message || null,
      };
    })
  );

  return roomsWithData;
};
