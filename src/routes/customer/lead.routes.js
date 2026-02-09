import { Router } from "express";
import { upload } from "../../utils/multerConfig.js";
import { createLead } from "../../controllers/Customer/lead.controller.js";

const router = Router();

/**
 * Accepts:
 * - application/json
 * - multipart/form-data
 */
router.post("/", upload.none(), createLead);

export default router;
