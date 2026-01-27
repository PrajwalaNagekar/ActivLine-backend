// models/settings/generalSettings.model.js
import mongoose from "mongoose";

const generalSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    supportEmail: { type: String, required: true },
    supportPhone: { type: String },
    address: { type: String, required: true },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("GeneralSettings", generalSettingsSchema);
