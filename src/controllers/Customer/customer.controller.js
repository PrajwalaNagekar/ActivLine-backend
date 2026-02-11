// import { createCustomerSchema } from "../../validations/Customer/customer.validation.js";

import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import Customer from "../../models/Customer/customer.model.js";
import jwt from "jsonwebtoken";
// import { loginCustomerSchema } from "../../validations/Customer/customer.validation.js";
import { createCustomerService ,updateCustomerService} from "../../services/Customer/customer.service.js";
import { getMyProfileService } from "../../services/Customer/customer.service.js";


// import Customer from "../../models/Customer/customer.model.js";
import ApiError from "../../utils/ApiError.js";

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await createCustomerService(req.body, req.files);

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: customer, // 🔥 FULL MODEL HERE
  });
});



export const updateCustomer = asyncHandler(async (req, res) => {
  const { activlineUserId } = req.params;

  const result = await updateCustomerService(
    activlineUserId,
    req.body,
    req.files
  );

  res.status(200).json({
    success: true,
    message: "Customer updated successfully",
    data: result,
  });
});

// export const loginCustomer = async (req, res) => {
//   const { error, value } = loginCustomerSchema.validate(req.body);
//   if (error) throw error;

//   const result = await CustomerService.loginCustomer(value);

//   res.status(200).json(
//     ApiResponse.success(result, "Login successful")
//   );
// };



export const loginCustomer = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Username/Phone and password are required",
    });
  }

  const user = await Customer.findOne({
    $or: [
      { userName: identifier },
      { phoneNumber: identifier }
    ]
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid user credentials",
    });
  }

  const accessToken = jwt.sign(
    { _id: user._id, role: "CUSTOMER" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET || "refresh-secret",
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
  );

  const loggedInUser = await Customer.findById(user._id).select("-password");

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: loggedInUser,
      accessToken,
      refreshToken,
    },
  });
});



export const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const profile = await getMyProfileService(userId);

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: profile,
  });
});

export const updateCustomerReferralCode = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { referralCode } = req.body;

  if (!referralCode) {
    throw new ApiError(400, "Referral code is required");
  }

  // Check uniqueness
  const exists = await Customer.findOne({
    "referral.code": referralCode,
    _id: { $ne: customerId }
  });

  if (exists) {
    throw new ApiError(409, "Referral code already in use");
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  customer.referral.code = referralCode;
  await customer.save();

  res.json({
    success: true,
    message: "Referral code updated successfully",
    data: {
      customerId,
      referralCode
    }
  });
});


export const deleteCustomerReferralCode = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  customer.referral.code = null;
  await customer.save();

  res.json({
    success: true,
    message: "Referral code deleted"
  });
});


export const getMyReferralCode = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const customer = await Customer.findById(userId).select("referral");

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  res.status(200).json({
    success: true,
    data: {
      referralCode: customer.referral?.code || null
    }
  });
});
