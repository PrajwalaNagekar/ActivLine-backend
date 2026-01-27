// validations/generalSettings.validation.js
import { ApiError } from "../../../utils/ApiError.js";

export const validateGeneralSettings = (body) => {
  const { companyName, supportEmail, address } = body;

  if (!companyName?.trim()) {
    throw new ApiError(400, "Company name is required");
  }

  if (!supportEmail || !/^\S+@\S+\.\S+$/.test(supportEmail)) {
    throw new ApiError(400, "Valid support email is required");
  }

  if (!address?.trim()) {
    throw new ApiError(400, "Company address is required");
  }
};
