// // src/routes/staff/notification.routes.js
// import { Router } from "express";
// import auth from "../../middlewares/auth.middleware.js";

// import {
//   getMyStaffNotifications,
//   markStaffNotificationRead,
//   markAllStaffNotificationsRead,
//   deleteStaffNotification,
//   deleteAllStaffNotifications,
// } from "../../controllers/Notification/staff.notification.controller.js";

// const router = Router();

// router.get(
//   "/notifications",
//   auth("ADMIN_STAFF"),
//   getMyStaffNotifications
// );

// router.patch(
//   "/notifications/:id/read",
//   auth("ADMIN_STAFF"),
//   markStaffNotificationRead
// );

// router.patch(
//   "/notifications/read-all",
//   auth("ADMIN_STAFF"),
//   markAllStaffNotificationsRead
// );

// router.delete(
//   "/notifications/:id",
//   auth("ADMIN_STAFF"),
//   deleteStaffNotification
// );

// router.delete(
//   "/notifications",
//   auth("ADMIN_STAFF"),
//   deleteAllStaffNotifications
// );

// export default router;
