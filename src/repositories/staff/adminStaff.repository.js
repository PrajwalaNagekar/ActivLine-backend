import Admin from "../../models/auth/auth.model.js";


export const findAllAdminStaff = async () => {
  return Admin.find({ role: "ADMIN_STAFF" }).select("-password");
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
