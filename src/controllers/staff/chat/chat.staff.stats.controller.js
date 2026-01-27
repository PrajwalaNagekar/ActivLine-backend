import { asyncHandler } from "../../../utils/AsyncHandler.js";
import ApiResponse from "../../../utils/ApiReponse.js";
import * as Service from "../../../services/staff/chat/chat.staff.stats.service.js";

export const getOpenTickets = asyncHandler(async (req, res) => {
  const data = await Service.getOpenTickets(req.user._id);
  res.json(ApiResponse.success(data, "Open tickets fetched"));
});

export const getInProgressTickets = asyncHandler(async (req, res) => {
  const data = await Service.getInProgressTickets(req.user._id);
  res.json(ApiResponse.success(data, "In-progress tickets fetched"));
});

export const getResolvedTickets = asyncHandler(async (req, res) => {
  const data = await Service.getResolvedTickets(req.user._id);
  res.json(ApiResponse.success(data, "Resolved tickets fetched"));
});

export const getClosedTickets = asyncHandler(async (req, res) => {
  const data = await Service.getClosedTickets(req.user._id);
  res.json(ApiResponse.success(data, "Closed tickets fetched"));
});

export const getTotalTickets = asyncHandler(async (req, res) => {
  const data = await Service.getTotalTickets(req.user._id);
  res.json(ApiResponse.success(data, "Total tickets fetched"));
});
