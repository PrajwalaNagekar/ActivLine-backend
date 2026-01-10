// src/repositories/admin/admin.profile.repository.js
import Admin from "../../models/auth/auth.model.js";

export const findById = async (id) => {
  return Admin.findById(id);
};
export const findByEmail = async (email) => {
  return Admin.findOne({ email });
};
export const updateById = async (id, updateData) => {
  return Admin.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const createAuth = async (data) => {
  const admin = new Admin(data);
  return admin.save();
};
