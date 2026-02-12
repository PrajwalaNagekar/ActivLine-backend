import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import Customer from "../../models/Customer/customer.model.js";

export const resetPassword = asyncHandler(async (req, res) => {
  const { identifier, otp, newPassword, reenterPassword } = req.body;

  // 1️⃣ Validate inputs
  if (!identifier || !otp || !newPassword || !reenterPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword !== reenterPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  // 2️⃣ Find customer
  const customer = await Customer.findOne({
    $or: [
      { phoneNumber: identifier },
      { emailId: identifier.toLowerCase() },
    ],
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // 3️⃣ Validate OTP
  if (!customer.otp?.code) {
    throw new ApiError(400, "OTP not requested");
  }

  if (customer.otp.code !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (customer.otp.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  // 4️⃣ Update password (BCrypt auto via schema)
  customer.password = newPassword;

  // 5️⃣ Clear OTP
  customer.otp = { code: null, expiresAt: null };

  await customer.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});
