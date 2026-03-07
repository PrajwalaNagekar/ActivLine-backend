import { fetchAdminsByFranchise } from "../../services/franchise/admin.service.js";

export const getFranchiseAdmins = async (req, res) => {

  try {

    const { accountId } = req.params;

    const admins = await fetchAdminsByFranchise(accountId);

    res.status(200).json({
      success: true,
      message: "Franchise admins fetched successfully",
      data: admins
    });

  } catch (error) {

    console.error("Admin API error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};