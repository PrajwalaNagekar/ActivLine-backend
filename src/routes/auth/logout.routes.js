import { Router } from "express";
import { logout } from "../../controllers/auth/logout.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// 🔐 Logout only own account
router.post("/logout", verifyJWT, logout);

export default router;
