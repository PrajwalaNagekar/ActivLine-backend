import { Router } from "express";

const router = Router();

router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "Admin dashboard access granted",
    admin: req.user,
  });
});

export default router;
