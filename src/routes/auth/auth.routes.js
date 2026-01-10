import { Router } from "express";
import { login } from "../../controllers/auth/login.controller.js";
import { createUser } from "../../controllers/auth/auth.controller.js";
const router = Router();

router.post("/login", login);
router.post("/create", createUser);

export default router;
