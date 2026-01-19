import ApiError from "../../../utils/ApiError.js";
import * as AdminRepo from "../../../repositories/auth/auth.profile.repository.js";
import StaffStatus from "../../../models/staff/Staff.model.js";

export const createAdminStaff = async (payload) => {
  const exists = await AdminRepo.findByEmail(payload.email);
  if (exists) {
    throw new ApiError(409, "User with email already exists");
  }

  const staff = await AdminRepo.createAuth({
    name: payload.name,
    email: payload.email,
    password: payload.password,

    // 🔒 FORCE ROLE
    role: "ADMIN_STAFF",

    phone: payload.phone || null,
    fcmToken: payload.fcmToken || null,
    createdBy: payload.createdBy,
  });

  await StaffStatus.create({
    staffId: staff._id,
    status: "ACTIVE",
  });

  return {
    id: staff._id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    status: "ACTIVE",
    createdAt: staff.createdAt,
  };
};
