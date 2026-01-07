import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/admin.model.js";
import Customer from "../models/customer.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        // If no token is present, throw an unauthorized error.
        // throw new ApiError(401, "Unauthorized request. No token provided.");
        return next();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const Customer =
            (await Customer.findById(decodedToken?._id).select("-password")) ||
            (await Admin.findById(decodedToken?._id).select("-password"));

        if (!Customer) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.Customer = Customer;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

export const isSuperAdmin = asyncHandler(async (req, _, next) => {
    if (req.Customer?.userType !== "Admin") {
        throw new ApiError(403, "Forbidden: This action is restricted to Sub Admins.");
    }
    next();
});