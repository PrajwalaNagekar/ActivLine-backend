import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import Customer from "../../models/Customer/user.model.js";
import CustomerSession from "../../models/Customer/customerLogin.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/customerTokens.js";
import jwt from "jsonwebtoken";

export const customerLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, customerId, password } = req.body;

  if (!phoneNumber && !(customerId && password)) {
    throw new ApiError(400, "Phone number or customerId + password required");
  }

  // 1️⃣ Find customer
  let customer;
  if (phoneNumber) {
    customer = await Customer.findOne({ phoneNumber });
  } else {
    customer = await Customer.findOne({ accountId: customerId });
    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      throw new ApiError(401, "Invalid credentials");
    }
  }

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // 2️⃣ Device ID
  const deviceId =
    req.headers["x-device-id"] ||
    crypto.randomBytes(8).toString("hex");

  // 3️⃣ Tokens
  const accessToken = generateAccessToken(customer);
  const refreshToken = generateRefreshToken(customer, deviceId);

  // 4️⃣ Save refresh token (per device)
  await CustomerSession.findOneAndUpdate(
    { customerId: customer._id, deviceId },
    {
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lastUsedAt: new Date(),
    },
    { upsert: true }
  );

  // 5️⃣ Response
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 2 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Login successful",
      deviceId,
      accessToken,
      refreshToken,
    //   customer: {
    //     fullName: customer.fullName,
    //   },
    });
});
// src/controllers/auth/customerAuth.controller.js


/**
 * =========================
 * REFRESH ACCESS TOKEN
 * =========================
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.headers["x-refresh-token"];

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const session = await CustomerSession.findOne({
    customerId: decoded._id,
    deviceId: decoded.deviceId,
    refreshToken,
  });

  if (!session) {
    throw new ApiError(401, "Session expired. Login again");
  }

  const customer = await Customer.findById(decoded._id);
  if (!customer) {
    throw new ApiError(401, "Customer not found");
  }

  const newAccessToken = generateAccessToken(customer);

  res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 2 * 60 * 1000,
    })
    .json({
      success: true,
      message: "Access token refreshed",
       accessToken: newAccessToken,
    });
});

export const customerLogout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await CustomerSession.deleteOne({ refreshToken });
  }

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
      success: true,
      message: "Logged out",
    });
});
