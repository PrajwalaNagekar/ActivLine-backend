// src/controllers/auth/profile.controller.js
import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import * as ProfileService from "../../services/auth/profile.service.js";

// ✅ GET OWN PROFILE
export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await ProfileService.getMyProfile(req.user._id);

  return res
    .status(200)
    .json(ApiResponse.success(profile, "Profile fetched successfully"));
});

// (already existing)
export const updateMyProfile = asyncHandler(async (req, res) => {
  const updatedUser = await ProfileService.updateMyProfile(
    req.user._id,
    req.body
  );

  return res
    .status(200)
    .json(ApiResponse.success(updatedUser, "Profile updated successfully"));
});
