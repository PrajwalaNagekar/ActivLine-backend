// src/controllers/staff/staff.notification.controller.js
import Notification from "../../models/Notification/notification.model.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";

/**
 * =========================
 * GET MY NOTIFICATIONS
 * =========================
 */
export const getMyStaffNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipientUser: req.user._id,
    recipientRole: "ADMIN_STAFF",
  }).sort({ createdAt: -1 });

  res.json(ApiResponse.success(notifications));
});

/**
 * =========================
 * MARK ONE AS READ
 * =========================
 */
export const markStaffNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      recipientUser: req.user._id,
    },
    { isRead: true }
  );

  res.json(ApiResponse.success(null, "Notification marked as read"));
});

/**
 * =========================
 * MARK ALL AS READ
 * =========================
 */
export const markAllStaffNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      recipientUser: req.user._id,
      recipientRole: "ADMIN_STAFF",
      isRead: false,
    },
    { isRead: true }
  );

  res.json(ApiResponse.success(null, "All notifications marked as read"));
});

/**
 * =========================
 * DELETE ONE
 * =========================
 */
export const deleteStaffNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    recipientUser: req.user._id,
  });

  res.json(ApiResponse.success(null, "Notification deleted"));
});

/**
 * =========================
 * DELETE ALL
 * =========================
 */
export const deleteAllStaffNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({
    recipientUser: req.user._id,
    recipientRole: "ADMIN_STAFF",
  });

  res.json(ApiResponse.success(null, "All notifications deleted"));
});
