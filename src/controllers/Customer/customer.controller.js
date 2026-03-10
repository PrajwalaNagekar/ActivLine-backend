import mongoose from "mongoose";
import Customer from "../../models/Customer/customer.model.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiReponse.js";

/**
 * @description Get all customers with filtering, searching, and pagination
 * @route GET /api/customer/customers
 * @access Private (ADMIN, SUPER_ADMIN, FRANCHISE_ADMIN)
 */
export const getCustomers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    userGroupId, // for plan-wise filtering
    search, // for name search
  } = req.query;

  const filter = {};

  // Scope results for franchise admins
  if (req.user?.role === "FRANCHISE_ADMIN") {
    filter.accountId = req.user.accountId;
  }

  // Add status filter if provided
  if (status) {
    filter.status = status.toUpperCase();
  }

  // Add plan (userGroupId) filter if provided
  if (userGroupId) {
    filter.userGroupId = userGroupId;
  }

  // Add search functionality for name fields
  if (search) {
    const searchRegex = new RegExp(search, "i"); // case-insensitive regex
    filter.$or = [
      { firstName: { $regex: searchRegex } },
      { lastName: { $regex: searchRegex } },
      { userName: { $regex: searchRegex } },
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [customers, totalCustomers] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Customer.countDocuments(filter),
  ]);

  return res
    .status(200)
    .json(
      ApiResponse.success(customers, "Customers fetched successfully", {
        page: pageNum,
        limit: limitNum,
        total: totalCustomers,
        totalPages: Math.ceil(totalCustomers / limitNum),
      })
    );
});

/**
 * @description Get a single customer by its ID
 * @route GET /api/customer/customers/:customerId
 * @access Private (ADMIN, SUPER_ADMIN, FRANCHISE_ADMIN)
 */
export const getCustomerById = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw new ApiError(400, "Invalid Customer ID format");
  }

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Security check: A franchise admin can only view customers from their own franchise.
  if (req.user?.role === "FRANCHISE_ADMIN" && customer.accountId !== req.user.accountId) {
    throw new ApiError(403, "Access Denied. You can only view customers from your franchise.");
  }

  return res
    .status(200)
    .json(ApiResponse.success(customer, "Customer details fetched successfully"));
});