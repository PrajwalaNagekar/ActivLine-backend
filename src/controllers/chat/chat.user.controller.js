// src/controllers/chat/chat.user.controller.js
import * as ChatService from "../../services/chat/chat.service.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { createActivityLog } from "../../services/ActivityLog/activityLog.service.js";
export const openChat = asyncHandler(async (req, res) => {
  const room = await ChatService.openChatIfNotExists(req);
   await createActivityLog({
    req,
    action: "CREATE",
    module: "CHAT",
    description: "Customer opened chat",
    targetId: room._id,
  });
  res.json(ApiResponse.success(room, "Chat room ready"));
});


export const getMyMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const messages = await ChatService.getMessagesByRoom(roomId);

  res.json(
    ApiResponse.success(messages, "Customer messages fetched")
  );
});

export const getMyChatRooms = asyncHandler(async (req, res) => {
  const customerId = req.user._id;

  const rooms = await ChatService.getMyChatRooms(customerId);

  res.json(
    ApiResponse.success(rooms, "Customer chat rooms fetched")
  );
});
