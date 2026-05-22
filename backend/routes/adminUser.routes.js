import express from "express";
import {
    getUserCount, getUserData
} from "../controllers/users.controller.js";

const router = express.Router();

// Get users count
router.get("/count", getUserCount);

// Get User Data
router.get("/getUserData", getUserData)


export default router;