import Admin from "../../models/auth/auth.model.js";

// find user
export const findUserById = (userId) => {
  return Admin.findById(userId);
};

// remove only specific FCM token
export const removeFCMToken = async (userId, fcmToken) => {
  await Admin.findByIdAndUpdate(userId, {
    $unset: { fcmToken: "" }, // single FCM token model
  });
};

// clear full session (normal logout)
export const clearSession = async (userId) => {
  await Admin.findByIdAndUpdate(userId, {
    refreshToken: null,
    fcmToken: null,
  });
};
