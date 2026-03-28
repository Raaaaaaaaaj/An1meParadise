import express from "express";
import {addCategory, getCategories} from "../controllers/categories.controller.js"
const router = express.Router();

router.post("/add", addCategory);
router.get("/", getCategories);

export default router;