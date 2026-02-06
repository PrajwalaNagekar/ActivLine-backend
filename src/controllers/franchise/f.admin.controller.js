import { getAllAdmins } from "../../services/franchise/f.admin.service.js";

export const fetchAllAdmins = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);

    const accountId = req.body?.accountId; // ✅ safe access

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId missing from request body",
      });
    }

    const data = await getAllAdmins(accountId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};


