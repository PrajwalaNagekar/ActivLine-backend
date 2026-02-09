import jwt from "jsonwebtoken";

export const generateAccessToken = (customer) => {
  return jwt.sign(
    {
      _id: customer._id,
      role: "CUSTOMER",
      phoneNumber: customer.phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" } // 🔥 2 minutes
  );
};

export const generateRefreshToken = (customer, deviceId) => {
  return jwt.sign(
    {
      _id: customer._id,
      deviceId,
      purpose: "REFRESH",
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};
