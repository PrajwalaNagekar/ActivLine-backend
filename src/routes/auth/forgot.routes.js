import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
} from "../../controllers/auth/forgot.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post("/forgot-password",verifyJWT,forgotPassword);
router.post("/reset-password",verifyJWT, resetPassword);

export default router;
