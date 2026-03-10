import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
} from "../../controllers/customer/customer.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/role.middleware.js";

const router = Router();

// This route handles fetching all customers
router
  .route("/customers")
  .get(verifyJWT, allowRoles("ADMIN", "SUPER_ADMIN", "FRANCHISE_ADMIN", "ADMIN_STAFF"), getCustomers);

// This new route handles fetching a single customer by their ID
router
  .route("/customers/:customerId")
  .get(verifyJWT, allowRoles("ADMIN", "SUPER_ADMIN", "FRANCHISE_ADMIN", "ADMIN_STAFF"), getCustomerById);

export default router;
