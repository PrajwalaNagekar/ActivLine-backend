import ApiError from "../../utils/ApiError.js";

export const validateForgotPassword = ({ email }) => {
  if (!email) throw new ApiError(400, "Email is required");
};

export const validateResetPassword = ({ email, otp, password }) => {
  if (!email || !otp || !password) {
    throw new ApiError(400, "All fields are required");
  }
};
