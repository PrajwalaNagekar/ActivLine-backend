// src/utils/fcm.js
import { firebaseAdmin } from "../config/firebase.js";

export const sendFCM = async (token, title, body) => {
  if (!token) return;

  // Use the initialized firebaseAdmin instance
  await firebaseAdmin.messaging().send({
    token,
    notification: { title, body },
  });
};
