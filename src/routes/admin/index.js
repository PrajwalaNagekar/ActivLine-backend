import { Router } from "express";
// import publicRoutes from "./public.routes.js";
import adminRoutes from "./admin.routes.js";
// import adminAuthRoutes from "./auth.routes.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";
import adminTicketRoutes from "./Ticket/adminTicket.routes.js";
const router = Router();

/* ===== PUBLIC (NO JWT) ===== */
// router.use("/", publicRoutes);        // /create
// router.use("/auth", adminAuthRoutes); // /login

/* ===== PROTECTED ===== */
router.use(verifyJWT);
router.use(allowRoles("ADMIN"));
router.use("/", adminTicketRoutes);
router.use("/", adminRoutes);         // /dashboard

export default router;
