// controllers/generalSettings.controller.js
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import ApiResponse from "../../../utils/ApiReponse.js";
import {
  getGeneralSettingsService,
  updateGeneralSettingsService,
} from "../../../services/admin/settings/generalSettings.service.js";
import { validateGeneralSettings } from "../../../validations/admin/settings/generalSettings.validation.js";

export const getGeneralSettings = asyncHandler(async (req, res) => {
  const settings = await getGeneralSettingsService();

  res.status(200).json(
    ApiResponse.success(settings, "General settings fetched successfully")
  );
});

export const updateGeneralSettings = asyncHandler(async (req, res) => {
  validateGeneralSettings(req.body);

  const settings = await updateGeneralSettingsService(
    req.body,
    req.user._id
  );

  res.status(200).json(
    ApiResponse.success(settings, "General settings updated successfully")
  );
});
