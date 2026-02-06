import { Router } from "express";
import { fetchFranchiseAccounts } from "../../controllers/franchise/franchise.controller.js";
import { fetchAllAdmins } from "../../controllers/franchise/f.admin.controller.js";
import { upload } from "../../utils/multerConfig.js"; // adjust path if needed

const router = Router();

// 🔹 Franchise APIs
router.get("/", fetchFranchiseAccounts);
router.get("/:accountId", fetchFranchiseAccounts);

// 🔹 Franchise → Admin API (FORM-DATA SUPPORT)
router.post(
  "/admins",
  upload.none(), // 👈 THIS IS THE KEY LINE
  fetchAllAdmins
);

export default router;
