import mongoose from "mongoose";

const newConnectionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    installationAddress: {
      type: String,
      required: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "FEASIBLE", "INSTALLED", "REJECTED"],
      default: "NEW",
    },

    source: {
      type: String,
      default: "Mobile App",
    }
  },
  { timestamps: true }
);

export default mongoose.model("NewConnection", newConnectionSchema);
