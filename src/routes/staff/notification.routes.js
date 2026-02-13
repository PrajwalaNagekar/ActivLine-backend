import { Router } from "express";
import {auth} from "../../middlewares/auth.middleware.js";

import {
  getMyStaffNotifications,
  markStaffNotificationRead,
  markAllStaffNotificationsRead,
  deleteStaffNotification,
  deleteAllStaffNotifications,
  getStaffUnreadCount,
} from "../../controllers/Notification/staff.notification.controller.js";

const router = Router();

// ✅ GET all staff notifications
router.get(
  "/notifications",
  auth("ADMIN_STAFF"),
  getMyStaffNotifications
);

// ✅ MARK ONE AS READ
router.patch(
  "/notifications/:id/read",
  auth("ADMIN_STAFF"),
  markStaffNotificationRead
);

// ✅ MARK ALL AS READ
router.patch(
  "/notifications/read-all",
  auth("ADMIN_STAFF"),
  markAllStaffNotificationsRead
);

// ✅ DELETE ONE
router.delete(
  "/notifications/:id",
  auth("ADMIN_STAFF"),
  deleteStaffNotification
);

// ✅ DELETE ALL
router.delete(
  "/notifications",
  auth("ADMIN_STAFF"),
  deleteAllStaffNotifications
);

// 🔔 UNREAD COUNT
router.get(
  "/notifications/unread-count",
  auth("ADMIN_STAFF"),
  getStaffUnreadCount
);


export default router;
