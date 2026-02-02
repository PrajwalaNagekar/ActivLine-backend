// import { createCustomerSchema } from "../../validations/Customer/customer.validation.js";

import ApiResponse from "../../utils/ApiReponse.js";
import Customer from "../../models/Customer/user.model.js";
import jwt from "jsonwebtoken";
// import { loginCustomerSchema } from "../../validations/Customer/customer.validation.js";
import { createCustomerService ,updateCustomerService} from "../../services/Customer/customer.service.js";
import { getMyProfileService } from "../../services/Customer/customer.service.js";


export const createCustomer = async (req, res, next) => {
  try {
    const customer = await createCustomerService(req.body, req.files);

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer, // 🔥 FULL MODEL HERE
    });
  } catch (err) {
    next(err);
  }
};



export const updateCustomer = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

// export const loginCustomer = async (req, res) => {
//   const { error, value } = loginCustomerSchema.validate(req.body);
//   if (error) throw error;

//   const result = await CustomerService.loginCustomer(value);

//   res.status(200).json(
//     ApiResponse.success(result, "Login successful")
//   );
// };



export const loginCustomer = async (req, res, next) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and password are required",
      });
    }

    const user = await Customer.findOne({ mobile });

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
      { _id: user._id, email: user.email, role: user.role },
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
  } catch (err) {
    next(err);
  }
};



export const getMyProfile = async (req, res, next) => {
  try {
    const { activlineUserId } = req.user;

    const profile = await getMyProfileService(activlineUserId);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};
