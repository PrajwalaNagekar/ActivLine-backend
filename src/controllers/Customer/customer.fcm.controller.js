import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import CustomerSession from "../../models/Customer/customerLogin.model.js";
import Customer from "../../models/Customer/customer.model.js";

export const saveFcmToken = asyncHandler(async (req, res) => {
  const { fcmToken, deviceId, platform } = req.body;

  if (!fcmToken || !deviceId) {
    throw new ApiError(400, "fcmToken and deviceId are required");
  }

  // ✅ Find session by deviceId
  const session = await CustomerSession.findOne({ deviceId });

  if (!session) {
    throw new ApiError(404, "Active session not found. Login first");
  }

  // ✅ Avoid unnecessary DB writes
  if (session.fcmToken === fcmToken) {
    return res.status(200).json({
      success: true,
      message: "FCM token already up-to-date",
    });
  }

  session.fcmToken = fcmToken;
  if (platform) session.platform = platform;
  session.lastUsedAt = new Date();

  await session.save();

  // ✅ ALSO update the main Customer document (so you can see it in the User table)
  await Customer.findByIdAndUpdate(session.customerId, {
    $addToSet: { fcmTokens: fcmToken },
  });

  res.status(200).json({
    success: true,
    message: "FCM token saved successfully",
    deviceId,
    customerId: session.customerId,
  });
});
