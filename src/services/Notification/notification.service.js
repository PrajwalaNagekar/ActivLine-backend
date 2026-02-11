import {
  createNotificationRepo,
  getNotificationsByRoleRepo,
} from "../../repositories/Notification/notification.repository.js";

import { sendFirebaseNotificationByRoles } from "./firebase.sender.js";
import Admin from "../../models/auth/auth.model.js";

export const notifyAdminsOnLeadCreate = async (leadData) => {
  const rolesToNotify = ["ADMIN", "SUPER_ADMIN", "ADMIN_STAFF"];

  // 1️⃣ Create a single notification for all admin roles
 await Notification.create({
  title: "New Customer Lead Created",
  message: `Lead created by ${payload.firstName}`,
  data: payload,
  recipientUser: admin._id,
  recipientRole: admin.role,
  isRead: false,   // ✅ IMPORTANT
});


  // 3️⃣ Send Firebase push notifications (this function already handles finding users by roles)
  const firebasePayload = {
    title: "New Customer Lead Created",
    message: `Lead created by ${leadData?.firstName || "Customer"}`,
    data: leadData,
    roles: rolesToNotify,
  };

  try {
    await sendFirebaseNotificationByRoles(firebasePayload);
  } catch (err) {
    console.error("🔥 Firebase notification failed:", err.message);
    // ❗ DO NOT throw → lead API must still succeed
  }
};

export const getNotificationsForRole = async (role) => {
  return getNotificationsByRoleRepo(String(role).toUpperCase());
};
