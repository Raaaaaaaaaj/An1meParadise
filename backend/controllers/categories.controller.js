import { db } from "../config/db.js";

// ADD CATEGORY
export const addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    const sql = "INSERT INTO productcategories (category_name) VALUES (?)";

    const [result] = await db.query(sql, [category_name]);

    res.json({
      message: "Category added",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM productcategories");

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategoriesWithCount = async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.id,
        c.category_name,
        COUNT(p.id) AS total_products
      FROM productcategories c 
      LEFT JOIN products p
      ON c.id = p.prod_category_id
      GROUP BY c.id
    `;

    const [result] = await db.query(sql);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE CATEGORY
export const removeCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const sql = "DELETE FROM productcategories WHERE id = ?";

    await db.query(sql, [categoryId]);

    res.json({
      message: "Category deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};