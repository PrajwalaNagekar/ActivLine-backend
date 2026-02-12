// services/Notification/customer.notification.service.js

import Notification from "../../models/Notification/customernotification.model.js";
import Customer from "../../models/Customer/customer.model.js";
import { sendPushNotification } from "./customerfirebase.service.js";

export const notifyCustomer = async ({
  customerId,
  title,
  message,
  type = "SYSTEM",
}) => {
  // 🔹 Save in DB
  const notification = await Notification.create({
    customerId,
    title,
    message,
    type,
  });

  // 🔹 Get customer FCM token
  const customer = await Customer.findById(customerId).select("fcmToken");

  if (customer?.fcmToken) {
    await sendPushNotification({
      fcmToken: customer.fcmToken,
      title,
      body: message,
    });
  }

  return notification;
};
