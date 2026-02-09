import { getFranchiseAccounts } from "../../services/franchise/franchise.service.js";

export const fetchFranchiseAccounts = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const data = await getFranchiseAccounts(accountId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
