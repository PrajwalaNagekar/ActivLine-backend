import ActivityLog from "../../models/ActivityLog/activityLog.model.js";

export const createLog = (payload) => ActivityLog.create(payload);

export const getLogs = (filter = {}, limit = 100) => {
  return ActivityLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const countLogs = (filter) =>
  ActivityLog.countDocuments(filter);


