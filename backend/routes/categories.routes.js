import express from "express";
import {addCategory, getCategories, getCategoriesWithCount} from "../controllers/categories.controller.js"
const router = express.Router();

router.post("/add", addCategory);
router.get("/", getCategories);

router.get("/with-count", getCategoriesWithCount);

export default router;