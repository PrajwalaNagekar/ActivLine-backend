// routes/activline.routes.js
import express from "express";
import {
  getFilteredUsers,
  getProfileDetails,
} from "../../controllers/Customer/activline.controller.js";
import { allowRolesExceptCustomer } from "../../middlewares/role.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/activline/user/:page/:perPage",
  verifyJWT,
  allowRolesExceptCustomer,
  getFilteredUsers
);

router.get(
  "/activline/get_profile_details/:profileId",
  verifyJWT,
  allowRolesExceptCustomer,
  getProfileDetails
);

export default router;
