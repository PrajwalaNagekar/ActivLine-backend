import { Router } from "express";
import { getAdminTickets } from "../../../controllers/Admin/Ticket/adminTicket.controller.js";
import { asyncHandler } from "../../../utils/AsyncHandler.js";

const router = Router();

/**
 * POST /api/admin/tickets
 */
router.post("/tickets", asyncHandler(getAdminTickets));

export default router;
