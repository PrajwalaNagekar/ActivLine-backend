import { Router } from "express";
import { verifyJWT, auth } from "../../middlewares/auth.middleware.js";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../../controllers/Notification/customer.notification.controller.js";

const router = Router();

// 🔹 CUSTOMER NOTIFICATION ROUTES
router.get("/customer/me/notifications", verifyJWT, auth("CUSTOMER"), getMyNotifications);

router.get("/customer/me/notifications/unread-count", verifyJWT, auth("CUSTOMER"), getUnreadCount);

router.put("/customer/me/notifications/read-all", verifyJWT, auth("CUSTOMER"), markAllAsRead);

router.put("/customer/me/notifications/:id/read", verifyJWT, auth("CUSTOMER"), markAsRead);

router.delete("/customer/me/notifications/:id", verifyJWT, auth("CUSTOMER"), deleteNotification);

router.delete("/customer/me/notifications", verifyJWT, auth("CUSTOMER"), deleteAllNotifications);

export default router;
