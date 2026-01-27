import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    // 🔹 Activline core fields
    userGroupId: {
      type: Number,
      required: true,
    },

    accountId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    emailId: {
      type: String,
    },

    // 🔹 Optional fields
    userState: String,
    userType: String,
    activationDate: String,

    firstName: String,
    lastName: String,

    address: {
      line1: String,
      city: String,
      pin: String,
      state: String,
      country: String,
    },

    // 🔹 External system reference
    activlineUserId: {
      type: String,
    },

    // 🔹 Files
    documents: {
      idFile: String,
      addressFile: String,
    },

    // 🔹 Audit
    rawPayload: {
      type: Object,
    },

    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const Customer =
  mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);

export default Customer;
