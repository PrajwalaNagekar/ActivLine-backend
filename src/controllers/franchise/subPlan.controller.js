import { getSubPlans } from "../../services/franchise/subPlan.service.js";

export const fetchSubPlans = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: "groupId is required",
      });
    }

    const data = await getSubPlans(groupId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
