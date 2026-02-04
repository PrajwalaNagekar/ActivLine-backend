import { createNotificationRepo, getNotificationsByRoleRepo } 
from "../../repositories/Notification/notification.repository.js";

export const notifyAdminsOnLeadCreate = async (leadData) => {
  return createNotificationRepo({
    title: "New Customer Lead Created",
    message: `Lead created by ${leadData.firstName || "Customer"}`,
    data: leadData,
    roles: ["ADMIN", "SUPER_ADMIN", "STAFF"]
  });
};

export const getNotificationsForRole = async (role) => {
  return getNotificationsByRoleRepo(role);
};
