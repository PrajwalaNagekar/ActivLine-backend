import Customer from "../models/Customer/customer.model.js";

export const generateReferralCode = async (firstName) => {
  const prefix = (firstName || "USER")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 6);

  const count = await Customer.countDocuments({
    "referral.code": { $regex: `^${prefix}` }
  });

  return `${prefix}${String(count + 1).padStart(4, "0")}`;
};
