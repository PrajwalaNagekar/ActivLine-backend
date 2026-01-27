// src/controllers/chat/chat.user.controller.js
import * as ChatService from "../../services/chat/chat.service.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

export const openChat = asyncHandler(async (req, res) => {
  const room = await ChatService.openChatIfNotExists(req.user._id);
  res.json(ApiResponse.success(room, "Chat room ready"));
});


export const getMyMessages = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const messages = await ChatService.getMessagesByRoom(roomId);

  res.json(
    ApiResponse.success(messages, "Customer messages fetched")
  );
});