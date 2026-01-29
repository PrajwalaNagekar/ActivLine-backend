import { getUsageSummary } from "../../services/customer/dashboar.services.js";

export const getUserUsage = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { fromDate, toDate } = req.query;

    const data = await getUsageSummary(userId, fromDate, toDate);

    res.json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};
