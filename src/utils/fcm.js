// src/utils/fcm.js
import admin from "firebase-admin";
import serviceAccount from "../../firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendFCM = async (token, title, body) => {
  if (!token) return;

  await admin.messaging().send({
    token,
    notification: { title, body },
  });
};
