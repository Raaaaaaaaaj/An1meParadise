import { db } from "../config/db.js";

// Get Category Count
export const getCategoryCount = async() => {
    const sql = `
        SELECT COUNT(*) AS totalCategories FROM productcategories
    `
    const[rows] = await db.query(sql);
    return rows[0].totalCategories;
}