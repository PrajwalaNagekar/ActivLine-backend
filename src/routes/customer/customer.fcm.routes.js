import { Router } from "express";
import { saveFcmToken } from "../../controllers/Customer/customer.fcm.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/fcm-token",   // ✅ renamed for clarity
  upload.none(),
  saveFcmToken
);

export default router;
