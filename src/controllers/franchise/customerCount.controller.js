import Customer from "../../models/Customer/customer.model.js";

export const getFranchiseCustomerCount = async (req, res) => {
  try {
    const requestedAccountId = String(req.params?.accountId || "").trim();

    if (!requestedAccountId) {
      return res.status(400).json({
        success: false,
        message: "accountId is required",
      });
    }

    if (req.user?.role === "FRANCHISE_ADMIN") {
      const ownAccountId = String(req.user.accountId || "").trim();

      if (!ownAccountId || ownAccountId !== requestedAccountId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    const totalCustomers = await Customer.countDocuments({
      accountId: requestedAccountId,
    });

    return res.status(200).json({
      success: true,
      data: {
        accountId: requestedAccountId,
        totalCustomers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

