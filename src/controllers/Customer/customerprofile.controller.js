import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiReponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { getActivlineUserDetails,editActivlineUserProfile } from "../../services/customer/customerprofile.service.js";

export const fetchUserFullDetails = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    throw new ApiError(400, "user_id is required");
  }

  const activlineData = await getActivlineUserDetails(user_id);

  return res.status(200).json({
    success: true,
    message: "User full details fetched successfully",
    data: activlineData,
    meta: {
      source: "activline"
    }
  });
});


export const editUserProfile = asyncHandler(async (req, res) => {
  const payload = req.body;

  if (!payload.userId) {
    throw new ApiError(400, "userId is required");
  }

  const activlineResponse = await editActivlineUserProfile(payload);

  return res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: activlineResponse,
  });
});
