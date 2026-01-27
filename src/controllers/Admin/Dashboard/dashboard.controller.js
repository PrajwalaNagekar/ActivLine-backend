import { asyncHandler } from "../../../utils/AsyncHandler.js";
import ApiResponse from "../../../utils/ApiReponse.js";
import * as DashboardService from "../../../services/admin/Dashboard/dashboard.service.js";

/* OPEN */
export const getOpenTickets = asyncHandler(async (req, res) => {
  const data = await DashboardService.getOpenTickets();
  res.json(ApiResponse.success(data, "Open tickets fetched"));
});

/* IN PROGRESS */
export const getInProgressTickets = asyncHandler(async (req, res) => {
  const data = await DashboardService.getInProgressTickets();
  res.json(ApiResponse.success(data, "In-progress tickets fetched"));
});

/* TODAY RESOLVED */
export const getTodayResolvedTickets = asyncHandler(async (req, res) => {
  const data = await DashboardService.getTodayResolvedTickets();
  res.json(ApiResponse.success(data, "Today resolved tickets fetched"));
});

/* TOTAL CUSTOMERS */
export const getTotalCustomers = asyncHandler(async (req, res) => {
  const data = await DashboardService.getTotalCustomers();
  res.json(ApiResponse.success(data, "Total customers fetched"));
});

/* RECENT TICKETS */
export const getRecentTickets = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const rooms = await DashboardService.getRecentTickets(limit);

  const mapped = rooms.map((room) => ({
    ticketId: room._id,
    subject: "Customer Support Chat",
    customer: room.customer?.fullName || "Unknown",
    status: room.status,
    createdAt: room.createdAt,
  }));

  res.json(ApiResponse.success(mapped, "Recent tickets fetched"));
});

export const getAssignedRoomsCount = asyncHandler(async (req, res) => {
  const data = await DashboardService.getAssignedRoomsCount();

  res.json(
    ApiResponse.success(data, "Assigned rooms count fetched")
  );
});
