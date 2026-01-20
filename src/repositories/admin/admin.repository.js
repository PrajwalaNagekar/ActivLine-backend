import Admin from "../../models/auth/auth.model.js";

export const findAllStaff = async () => {
  return Admin.find({ role: "ADMIN_STAFF" })
    .select("_id name email role fcmToken createdAt");
};
export const getAllStaff = () =>
  Admin.find({ role: "ADMIN_STAFF" })
    .select("_id name email mobile");


    export const clearRefreshToken = (userId) => {
  return Admin.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
};