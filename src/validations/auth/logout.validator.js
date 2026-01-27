import ApiError from "../../utils/ApiError.js";

export const validateLogout = ({ fcmToken }) => {
  if (fcmToken && typeof fcmToken !== "string") {
    throw new ApiError(400, "Invalid FCM token");
  }
};
