import express from "express";
import {addCategory, getCategories, getCategoriesWithCount ,removeCategory, updateCategory, categoryCount} from "../controllers/categories.controller.js"
const router = express.Router();

// Add Category
router.post("/add", addCategory);

// Get All Categories
router.get("/", getCategories);

// Category Count for CRM
router.get("/categoryCountForCRM", categoryCount)

// Update Category
router.put("/update/:id", updateCategory);

// GetCategories with Product Count for Client
router.get("/with-count", getCategoriesWithCount);

// router.get("/remove", removeCategory);
router.delete("/remove/:id", removeCategory);

export default router;