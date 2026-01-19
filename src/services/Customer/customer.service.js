import jwt from "jsonwebtoken";
import * as CustomerRepo from "../../repositories/Customer/customer.repository.js";
import ApiError from "../../utils/ApiError.js";

export const createCustomer = async (payload) => {
  const existing = await CustomerRepo.findByMobile(payload.mobile);
  if (existing) {
    throw new ApiError(409, "Mobile already registered");
  }

  const customerId = "ACT" + Date.now();

  const customer = await CustomerRepo.createCustomer({
    ...payload,
    customerId,
  });

  // ✅ THIS OBJECT CONTROLS THE RESPONSE
  return {
    _id: customer._id,
    customerId: customer.customerId,
    fullName: customer.fullName,
    mobile: customer.mobile,
    email: customer.email,
    role: customer.role,          // ✅ MUST BE HERE
    createdAt: customer.createdAt,
  };
};





export const loginCustomer = async ({ identifier, password }) => {
  const customer = await CustomerRepo.findByIdentifier(identifier);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  if (!customer.isActive) {
    throw new ApiError(403, "Account is inactive");
  }

  const isMatch = await customer.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    {
      _id: customer._id,
      role: customer.role,
      email: customer.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    accessToken: token,
    user: {
      _id: customer._id,
      customerId: customer.customerId,
      fullName: customer.fullName,
      mobile: customer.mobile,
      email: customer.email,
      role: customer.role,
    },
  };
};



export const getMessagesByRoom = async (roomId) => {
  return ChatMessageRepo.getMessagesByRoom(roomId);
};
