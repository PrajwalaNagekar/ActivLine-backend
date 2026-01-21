import * as Service from "../../services/chat/chat.dashboard.service.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await Service.getDashboardStats();
  res.json(ApiResponse.success(data, "Dashboard stats fetched"));
});

export const getRecentTickets = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 5);
  const data = await Service.getRecentTickets(limit);
  res.json(ApiResponse.success(data, "Recent tickets fetched"));
});
