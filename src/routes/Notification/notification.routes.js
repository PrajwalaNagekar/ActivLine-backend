import { Router } from "express";
import {
  getNotifications,
  markNotificationAsRead,
  deleteSingleNotification,
  deleteAllNotifications,
} from "../../controllers/Notification/notification.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * GET /api/notifications
 * admin | super_admin | staff
 */
router.get("/", verifyJWT, getNotifications);

/**
 * MARK single notification as read
 */
router.patch("/:id/read", verifyJWT, markNotificationAsRead);

/**
 * DELETE single notification
 */
router.delete("/:id", verifyJWT, deleteSingleNotification);

/**
 * DELETE all notifications (role-based)
 */
router.delete("/", verifyJWT, deleteAllNotifications);

export default router;
