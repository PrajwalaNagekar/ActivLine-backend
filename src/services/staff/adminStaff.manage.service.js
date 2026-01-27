import ApiError from "../../utils/ApiError.js";
import * as StaffRepo from "../../repositories/staff/adminStaff.repository.js";
import StaffStatus from "../../models/staff/Staff.model.js";
import * as LogoutRepo from "../../repositories/auth/logout.repository.js";



export const getAllAdminStaff = async () => {
  const staffList = await StaffRepo.findAllAdminStaff();

  const statuses = await StaffStatus.find({
    staffId: { $in: staffList.map((s) => s._id) },
  });

  const statusMap = statuses.reduce((acc, curr) => {
    acc[curr.staffId.toString()] = curr.status;
    return acc;
  }, {});

  return staffList.map((staff) => ({
    ...staff.toObject(),
    status: statusMap[staff._id.toString()] || "ACTIVE",
  }));
};

export const getSingleAdminStaff = async (staffId, requester) => {
  const staff = await StaffRepo.findAdminStaffById(staffId);

  if (!staff) {
    throw new ApiError(404, "Admin staff not found");
  }

  // Check permission
  const isAllowed =
    requester.role === "ADMIN" ||
    (requester.role === "ADMIN_STAFF" &&
      staff._id.toString() === requester._id.toString());

  if (!isAllowed) {
    throw new ApiError(403, "You are not allowed to view this staff");
  }

  const statusDoc = await StaffStatus.findOne({ staffId: staff._id });

  return {
    ...staff.toObject(),
    status: statusDoc ? statusDoc.status : "ACTIVE",
  };
};



export const updateAdminStaff = async (staffId, payload) => {
  const staff = await StaffRepo.findById(staffId);
  if (!staff) throw new ApiError(404, "Admin staff not found");

  let currentStatus = "ACTIVE";

  // Handle Status Update
  if (payload.status) {
    const statusDoc = await StaffStatus.findOneAndUpdate(
      { staffId: staff._id },
      { status: payload.status },
      { upsert: true, new: true }
    );
    currentStatus = statusDoc.status;

    if (payload.status === "TERMINATED") {
      await LogoutRepo.clearSession(staff._id);
    }
  } else {
    const statusDoc = await StaffStatus.findOne({ staffId: staff._id });
    if (statusDoc) currentStatus = statusDoc.status;
  }

  const { status, ...updateData } = payload;
  const updatedStaff = await StaffRepo.updateById(staffId, updateData);

  return {
    ...updatedStaff.toObject(),
    status: currentStatus,
  };
};

export const deleteAdminStaff = async (staffId) => {
  const staff = await StaffRepo.findById(staffId);
  if (!staff) throw new ApiError(404, "Admin staff not found");

  return StaffRepo.deleteById(staffId);
};
