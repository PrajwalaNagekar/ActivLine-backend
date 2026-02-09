import Notification from "../../models/Notification/notification.model.js";

export const createNotificationRepo = (payload) => {
  return Notification.create(payload);
};

export const getNotificationsByRoleRepo = (role) => {
  return Notification.find({
    roles: role
  }).sort({ createdAt: -1 });
};
