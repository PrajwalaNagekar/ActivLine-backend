import { Router } from "express";
import { fetchFranchiseAccounts } from "../../controllers/franchise/franchise.controller.js";
import { fetchAllAdmins } from "../../controllers/franchise/f.admin.controller.js";
import { fetchSubPlans } from "../../controllers/franchise/subPlan.controller.js";
import { fetchGroupDetails } from "../../controllers/franchise/groupDetails.controller.js";
import { upload } from "../../utils/multerConfig.js";
import { getProfiles } from "../../controllers/franchise/profile.controller.js";
import { getProfileDetails } from "../../controllers/franchise/profileDetails.controller.js";
import { getFranchiseAdmins } from "../../controllers/franchise/admin.controller.js";

const router = Router();

router.post("/admins", upload.none(), fetchAllAdmins);

router.get("/group-details", fetchGroupDetails);
router.get("/sub-plans/:groupId", fetchSubPlans);

router.get("/", fetchFranchiseAccounts);
router.get("/:accountId", fetchFranchiseAccounts);
router.get("/:accountId/profiles", getProfiles);
router.get("/:accountId/profiles/:profileId", getProfiles);
router.get("/:accountId/profile-details/:profileId", getProfileDetails);
router.get("/:accountId/admins", getFranchiseAdmins);

export default router;
