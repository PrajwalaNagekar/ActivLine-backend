import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { getRoomSummary } from "../../services/chat/chatSummary.service.js";

export const getChatRoomSummary = asyncHandler(async (req, res) => {
  const { roomId } = req.params;

  const summary = await getRoomSummary(roomId);

  res.json(
    ApiResponse.success(summary, "Chat room summary fetched")
  );
});
