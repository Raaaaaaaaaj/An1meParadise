import { db } from "../config/db.js";

// ADD CATEGORY
export const addCategory = async (req, res) => {
  try {
    const { category_name, category_image } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const sql = `
      INSERT INTO productcategories (category_name, category_image)
      VALUES (?, ?)
    `;

    const [result] = await db.query(sql, [
      category_name,
      category_image || null,
    ]);

    res.json({
      message: "Category added",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//UPDATE CATEGORY

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { category_name, category_image } = req.body;

    if (!category_name && !category_image) {
      return res.status(400).json({
        message: "At least one field (name or image) is required",
      });
    }

    // 🔥 dynamic query build
    let fields = [];
    let values = [];

    if (category_name) {
      fields.push("category_name = ?");
      values.push(category_name);
    }

    if (category_image) {
      fields.push("category_image = ?");
      values.push(category_image);
    }

    const sql = `
      UPDATE productcategories 
      SET ${fields.join(", ")} 
      WHERE id = ?
    `;

    values.push(categoryId);

    await db.query(sql, values);

    res.json({
      message: "Category updated successfully",
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