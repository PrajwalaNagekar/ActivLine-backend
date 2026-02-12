// services/Notification/firebase.service.js

import { firebaseAdmin as admin } from "../../config/firebase.js";

export const sendPushNotification = async ({ fcmToken, title, body }) => {
  if (!fcmToken) return;

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
    });

    console.log("✅ Push notification sent");
  } catch (err) {
    console.error("❌ Firebase error:", err.message);
  }
};
