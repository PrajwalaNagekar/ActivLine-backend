import jwt from "jsonwebtoken";

export const generateAccessToken = (customer,deviceId) => {
   return jwt.sign(
    {
      _id: customer._id,
      role: "CUSTOMER",
      deviceId, 
      phoneNumber: customer.phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "90m" } // 30 minutes
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
