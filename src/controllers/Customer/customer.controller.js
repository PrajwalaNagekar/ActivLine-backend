import { createCustomerSchema } from "../../validations/Customer/customer.validation.js";
import * as CustomerService from "../../services/Customer/customer.service.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { loginCustomerSchema } from "../../validations/Customer/customer.validation.js";
export const createCustomer = async (req, res) => {
  // ✅ VALIDATION HAPPENS HERE
  const { error, value } = createCustomerSchema.validate(req.body, {
    abortEarly: false, // show all errors
  });

  if (error) {
    throw error; // handled by global error handler
  }

  // value = sanitized data
  const customer = await CustomerService.createCustomer(value);

  res
    .status(201)
    .json(ApiResponse.success(customer, "Customer created successfully"));
};


export const loginCustomer = async (req, res) => {
  const { error, value } = loginCustomerSchema.validate(req.body);
  if (error) throw error;

  const result = await CustomerService.loginCustomer(value);

  res.status(200).json(
    ApiResponse.success(result, "Login successful")
  );
};