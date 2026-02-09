import { Router } from "express";
import {
  customerLogin,
  customerLogout,
  refreshAccessToken,
} from "../../controllers/Customer/customerlogin.controller.js";

const router = Router();

/**
 * POST /api/customer/login
 */
router.post("/login", customerLogin);

/**
 * POST /api/customer/refresh
 */
router.post("/refresh", refreshAccessToken);

/**
 * POST /api/customer/logout
 */
router.post("/logout", customerLogout);

export default router;
