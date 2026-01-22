// services/generalSettings.service.js
import GeneralSettings from "../../../models/admin/Settings/generalSettings.model.js";

export const getGeneralSettingsService = async () => {
  let settings = await GeneralSettings.findOne();

  // Auto-create if not exists (first time)
  if (!settings) {
    settings = await GeneralSettings.create({
      companyName: "ActivLine Internet",
      supportEmail: "support@activline.in",
      address: "Not configured",
    });
  }

  return settings;
};

export const updateGeneralSettingsService = async (data, adminId) => {
  const settings = await GeneralSettings.findOneAndUpdate(
    {},
    { ...data, updatedBy: adminId },
    { new: true, upsert: true }
  );

  return settings;
};
