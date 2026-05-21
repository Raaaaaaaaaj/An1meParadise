import express from "express";
import {
    getUserCount
} from "../controllers/users.controller.js";

const router = express.Router();

// Get users count
router.get("/count", getUserCount);

export default router;