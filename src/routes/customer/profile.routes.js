import { Router } from "express";
import { fetchUserFullDetails } from "../../controllers/Customer/customerprofile.controller.js";
import {
  editUserProfile,
  verifyOtpAndUpdate,
} from "../../controllers/Customer/profile.controller.js";

const router = Router();

/**
 * GET /api/customer/profile/user/:user_id
 */
router.get("/user/:user_id", fetchUserFullDetails);

/**
 * POST /api/customer/profile/edit
 */
router.post("/edit", editUserProfile);

/**
 * POST /api/customer/profile/verify-update
 */
router.post("/verify-update", verifyOtpAndUpdate);

export default router;
