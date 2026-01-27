// import { createCustomerSchema } from "../../validations/Customer/customer.validation.js";

import ApiResponse from "../../utils/ApiReponse.js";
// import { loginCustomerSchema } from "../../validations/Customer/customer.validation.js";
import { createCustomerService ,updateCustomerService} from "../../services/Customer/customer.service.js";
import { loginCustomerService,getMyProfileService } from "../../services/Customer/customer.service.js";


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
    const { username, password, deviceId, deviceInfo } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required",
      });
    }

    const data = await loginCustomerService({
      username,
      password,
      deviceId,
      deviceInfo,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data,
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
