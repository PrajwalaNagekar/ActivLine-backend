import ApiError from "../../utils/ApiError.js";
import * as LogoutRepo from "../../repositories/auth/logout.repository.js";

export const logoutService = async ({ userId, fcmToken }) => {
  const user = await LogoutRepo.findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔥 Case 1: FCM token provided → remove only that
  if (fcmToken) {
    await LogoutRepo.removeFCMToken(userId, fcmToken);
    return;
  }

  // 🔥 Case 2: Normal logout → remove refresh token + FCM
  await LogoutRepo.clearSession(userId);
};
