import { getGroupDetails } from "../../services/franchise/groupDetails.service.js";

export const fetchGroupDetails = async (req, res, next) => {
  try {
    const data = await getGroupDetails();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};
