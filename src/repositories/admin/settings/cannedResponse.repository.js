import CannedResponse from "../../../models/admin/Settings/cannedResponse.model.js";

export const createCannedResponseRepo = (data) =>
  CannedResponse.create(data);

export const getAllCannedResponsesRepo = () =>
  CannedResponse.find({ isActive: true }).sort({ category: 1 });

export const updateCannedResponseRepo = (id, data) =>
  CannedResponse.findByIdAndUpdate(id, data, { new: true });

export const deleteCannedResponseRepo = (id) =>
  CannedResponse.findByIdAndDelete(id);
