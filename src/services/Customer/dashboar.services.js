import { getUserSessionDetails } from "../../external/api/dashboard.api.js";

export const getUsageSummary = async (userId, fromDate, toDate) => {
  const { data } = await getUserSessionDetails(userId, fromDate, toDate);

  const sessions = data?.data || [];

  return {
    totalDownload: sessions.reduce(
      (sum, s) => sum + Number(s.download_bytes || 0),
      0
    ),
    totalUpload: sessions.reduce(
      (sum, s) => sum + Number(s.upload_bytes || 0),
      0
    ),
    sessions,
  };
};
