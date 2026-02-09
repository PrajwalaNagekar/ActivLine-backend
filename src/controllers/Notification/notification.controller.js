import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiReponse.js";
import { getNotificationsForRole } from "../../services/Notification/notification.service.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const role = req.user.role; // admin | super_admin | staff

  const notifications = await getNotificationsForRole(role);

  res.status(200).json(
    ApiResponse.success(notifications, "Notifications fetched successfully")
  );
});
