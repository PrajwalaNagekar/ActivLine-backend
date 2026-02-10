import { firebaseAdmin } from "../../config/firebase.js";
import Admin from "../../models/auth/auth.model.js";

export const sendFirebaseNotificationByRoles = async ({
  title,
  message,
  data,
  roles,
}) => {
  if (!firebaseAdmin.apps.length) {
    console.error("❌ Firebase not initialized");
    return;
  }

  const users = await Admin.find({
    role: { $in: roles },
    fcmTokens: { $exists: true, $ne: [] },
  });

  if (!users.length) return;

  const tokens = users
    .flatMap((u) => u.fcmTokens)
    .map((d) => d.token)
    .filter(Boolean);

  if (!tokens.length) return;

  const response = await firebaseAdmin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title,
      body: message,
    },
    data: {
      type: "LEAD_CREATED",
      payload: JSON.stringify(data), // ✅ MUST be string
    },
  });

  // 🔥 Optional: log failures
  response.responses.forEach((res, idx) => {
    if (!res.success) {
      console.error("❌ Failed token:", tokens[idx], res.error?.message);
    }
  });
};
