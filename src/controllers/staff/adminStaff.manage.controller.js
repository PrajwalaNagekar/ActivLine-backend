import { asyncHandler } from "../../utils/AsyncHandler.js";
import ApiResponse from "../../utils/ApiReponse.js";
import { validateUpdateAdminStaff,validateStaffIdParam } from "../../validations/staff/adminStaff.manage.validation.js";
import * as StaffService from "../../services/staff/adminStaff.manage.service.js";


export const getAllAdminStaff = asyncHandler(async (req, res) => {
  const staffList = await StaffService.getAllAdminStaff();

  return res.json(
    ApiResponse.success(staffList, "Admin staff list fetched successfully")
  );
});

export const getSingleAdminStaff = asyncHandler(async (req, res) => {
  validateStaffIdParam(req.params.id);

  const staff = await StaffService.getSingleAdminStaff(
    req.params.id,
    req.user
  );

  return res.json(
    ApiResponse.success(staff, "Admin staff fetched successfully")
  );
});



export const updateAdminStaff = asyncHandler(async (req, res) => {
  validateUpdateAdminStaff(req.body);

  const staff = await StaffService.updateAdminStaff(
    req.params.id,
    req.body
  );

  return res.json(
    ApiResponse.success(staff, "Admin staff updated successfully")
  );
});

export const deleteAdminStaff = asyncHandler(async (req, res) => {
  await StaffService.deleteAdminStaff(req.params.id);

  return res.json(
    ApiResponse.success(null, "Admin staff deleted successfully")
  );
});
