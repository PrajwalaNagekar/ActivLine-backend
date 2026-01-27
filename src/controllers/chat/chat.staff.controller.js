import * as ChatService from "../../services/chat/chat.service.js";
import * as ChatRoomRepo from "../../repositories/chat/chatRoom.repository.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiError from "../../utils/ApiError.js";

export const getAssignedRooms = asyncHandler(async (req, res) => {
  const staffId = req.user._id;

  const rooms = await ChatService.getRoomsForStaff(staffId);

  res.json(
    ApiResponse.success(rooms, "Assigned chat rooms fetched")
  );
});
export const getAssignedRoomMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const staffId = req.user._id;

  const room = await ChatRoomRepo.findById(roomId);

  if (!room) {
    throw new ApiError(404, "Chat room not found");
  }

  // 🔐 STAFF CAN READ ONLY ASSIGNED ROOM
  const assignedStaffId =
  typeof room.assignedStaff === "object"
    ? room.assignedStaff._id.toString()
    : room.assignedStaff.toString();

if (assignedStaffId !== staffId.toString()) {
  throw new ApiError(403, "You are not assigned to this chat");
}


  const messages = await ChatService.getMessagesByRoom(roomId);

  res.json(
    ApiResponse.success(messages, "Staff chat messages fetched")
  );
});