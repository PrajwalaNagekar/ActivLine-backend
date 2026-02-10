import {
  createNotificationRepo,
  getNotificationsByRoleRepo,
} from "../../repositories/Notification/notification.repository.js";

import { sendFirebaseNotificationByRoles } from "./firebase.sender.js";

export const notifyAdminsOnLeadCreate = async (leadData) => {
  const payload = {
    title: "New Customer Lead Created",
    message: `Lead created by ${leadData?.firstName || "Customer"}`,
    data: leadData,
    roles: ["ADMIN", "SUPER_ADMIN", "STAFF"], // 🔒 enforce uppercase
  };

  // 1️⃣ Save notification in DB (must succeed)
  const notification = await createNotificationRepo(payload);

  // 2️⃣ Send Firebase popup (best-effort)
  try {
    await sendFirebaseNotificationByRoles(payload);
  } catch (err) {
    console.error("🔥 Firebase notification failed:", err.message);
    // ❗ DO NOT throw → lead API must still succeed
  }

  return notification;
};

export const getNotificationsForRole = async (role) => {
  return getNotificationsByRoleRepo(String(role).toUpperCase());
};

