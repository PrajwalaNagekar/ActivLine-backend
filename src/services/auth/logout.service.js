import ApiError from "../../utils/ApiError.js";
import * as LogoutRepo from "../../repositories/auth/logout.repository.js";
import * as AdminRepo from "../../repositories/admin/admin.repository.js";
import * as StaffStatusRepo from "../../repositories/staff/adminStaff.repository.js";

/**
 * LOGOUT SERVICE
 *
 * Supports:
 * 1️⃣ FCM-only logout (mobile/device)
 * 2️⃣ Full logout (web / normal)
 *
 * RULES:
 * - ADMIN → clear tokens only
 * - ADMIN_STAFF → clear tokens + set INACTIVE
 * - TERMINATED staff → status never changed
 * - Idempotent (safe to call multiple times)
 */
export const logoutService = async ({ userId, fcmToken }) => {
  // 🔍 Fetch user
  const user = await LogoutRepo.findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  /**
   * 🔔 CASE 1: FCM token logout only
   * (Mobile logout / device removal)
   */
  if (fcmToken) {
    await LogoutRepo.removeFCMToken(userId, fcmToken);
    return true;
  }

  /**
   * 🔐 CASE 2: FULL LOGOUT
   */

  // 1️⃣ Clear refresh token + all FCM tokens
  await LogoutRepo.clearSession(userId);

  // 2️⃣ ADMIN_STAFF → set INACTIVE (only if not TERMINATED)
  if (user.role === "ADMIN_STAFF") {
    const currentStatus = await StaffStatusRepo.getStatus(userId);

    if (currentStatus !== "TERMINATED") {
      await StaffStatusRepo.setStatus(userId, "INACTIVE");
    }
  }

  return true;
};
