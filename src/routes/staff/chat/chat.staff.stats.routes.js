import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { allowRoles } from "../../../middlewares/role.middleware.js";
import {
  getOpenTickets,
  getInProgressTickets,
  getResolvedTickets,
  getClosedTickets,
  getTotalTickets,
} from "../../../controllers/staff/chat/chat.staff.stats.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(allowRoles("ADMIN_STAFF"));

router.get("/stats/open", getOpenTickets);
router.get("/stats/in-progress", getInProgressTickets);
router.get("/stats/resolved", getResolvedTickets);
router.get("/stats/closed", getClosedTickets);
router.get("/stats/total", getTotalTickets);

export default router;
