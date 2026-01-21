import * as AdminRepo from "../../repositories/admin/admin.repository.js";

export const getAllStaff = async () => {
  const staff = await AdminRepo.findAllStaff();
  return staff;
};
export const getAdminStaffList = async () => {
  return AdminRepo.getAllStaff();
};

