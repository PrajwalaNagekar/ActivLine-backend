import {
  createNotificationRepo,
  getNotificationsByRoleRepo,
} from "../../repositories/Notification/notification.repository.js";

import { sendFirebaseNotificationByRoles } from "./firebase.sender.js";
import Admin from "../../models/auth/auth.model.js";

export const notifyAdminsOnLeadCreate = async (leadData) => {
  const rolesToNotify = ["ADMIN", "SUPER_ADMIN", "ADMIN_STAFF"];

  // 1️⃣ Find all users who should be notified
  const usersToNotify = await Admin.find({ role: { $in: rolesToNotify } }).select("_id role").lean();

  if (!usersToNotify.length) {
    console.log("Lead created, but no admins found to notify.");
    return;
  }

  // 2️⃣ Create a notification document in the DB for each admin
  const notificationPromises = usersToNotify.map(user => {
    return createNotificationRepo({
      title: "New Customer Lead Created",
      message: `Lead created by ${leadData?.firstName || "Customer"}`,
      data: leadData,
      recipientUser: user._id,
      recipientRole: user.role,
    });
  });

  await Promise.all(notificationPromises);

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
