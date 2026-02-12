import { Router } from "express";
import { forgotPassword } from "../../controllers/Customer/customer.forgotPassword.controller.js";
import { resetPassword } from "../../controllers/Customer/customer.resetPassword.controller.js";

const router = Router();

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
