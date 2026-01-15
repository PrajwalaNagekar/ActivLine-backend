import ApiError from "../../utils/ApiError.js";
import { generateOTP } from "../../utils/otp.util.js";
import { sendOTPEmail } from "../../utils/mail.util.js";
import * as ForgotRepo from "../../repositories/auth/forgot.repository.js";

/**
 * SEND OTP
 */
export const forgotPasswordService = async (email) => {
  const user = await ForgotRepo.findUserByEmail(email);
  if (!user) {
    throw new ApiError(404, "Email not registered");
  }

  // ⏳ Prevent OTP spam (1 minute cooldown)
  if (user.resetOTPExpiry && user.resetOTPExpiry > Date.now() - 60 * 1000) {
    throw new ApiError(429, "OTP already sent. Please wait 1 minute");
  }

  const otp = generateOTP();

  await ForgotRepo.saveOTP(user._id, String(otp));

  // ✅ SEND EMAIL
  await sendOTPEmail({
    to: email,
    otp,
  });
};

/**
 * RESET PASSWORD
 */
export const resetPasswordService = async ({ email, otp, password }) => {
  const user = await ForgotRepo.findValidOTPUser(email, String(otp));
  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  await ForgotRepo.updatePassword(user._id, password);
};
