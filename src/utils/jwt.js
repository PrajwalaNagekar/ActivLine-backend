import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};


export const generateResetToken = (payload) => {
  return jwt.sign(
    { ...payload, purpose: "PASSWORD_RESET" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};