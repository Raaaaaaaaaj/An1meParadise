import express from "express";
import {addCategory, getCategories, getCategoriesWithCount ,removeCategory} from "../controllers/categories.controller.js"
const router = express.Router();

router.post("/add", addCategory);
router.get("/", getCategories);

router.get("/with-count", getCategoriesWithCount);
// router.get("/remove", removeCategory);
router.delete("/remove/:id", removeCategory);




export default router;