import Admin from "../../models/auth/auth.model.js";
import StaffStatus from "../../models/staff/Staff.model.js";

export const findAllAdminStaff = async () => {
  return Admin.find({
    role: { $in: ["ADMIN", "ADMIN_STAFF"] }
  }).select("-password");
};


export const findAdminStaffById = async (id) => {
  return Admin.findById(id).select("-password");
};

export const findById = async (id) => {
  return Admin.findById(id);
};

export const updateById = async (id, updateData) => {
  return Admin.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteById = async (id) => {
  return Admin.findByIdAndDelete(id);
};


export const setStatus = (staffId, status) => {
  return StaffStatus.findOneAndUpdate(
    { staffId },
    { status },
    { upsert: true }
  );
};

export const getStatus = async (staffId) => {
  const statusDoc = await StaffStatus.findOne({ staffId });
  return statusDoc ? statusDoc.status : null;
};