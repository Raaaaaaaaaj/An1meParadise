import express from "express";
import {
  updateProfile,
  changePassword,
} from "../controllers/profile.controller.js";

const router = express.Router();

// ✅ Profile update
router.put("/profile", updateProfile);

// 🔐 Change password
router.put("/change-password", changePassword);

export default router;