import express from "express";
import {
  updateProfile,
  changePassword,
  getUserProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

// ✅ Profile update
router.put("/profile", updateProfile);

// 🔐 Change password
router.put("/change-password", changePassword);


router.get("/profile/:user_id", getUserProfile);

export default router;