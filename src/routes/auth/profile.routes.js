import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../../controllers/auth/profile.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", verifyJWT, getMyProfile);
router.put("/edit", verifyJWT, updateMyProfile);

export default router;
