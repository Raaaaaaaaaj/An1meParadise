import { db } from "../config/db.js"

// Get single category
export const addCategory = (req, res) => {
  const { category_name } = req.body;

  const sql = "INSERT INTO productcategories (category_name) VALUES (?)";

  db.query(sql, [category_name], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Category added",
      id: result.insertId,
    });
  });
};

// Get all categories
export const getCategories = (req, res) => {
  db.query("SELECT * FROM productcategories", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

// Get Categories with product count
export const getCategoriesWithCount = (req, res) => {
    const sql = `
        SELECT 
        c.id,
        c.category_name,
        count(p.id) AS total_products
        FROM productcategories c 
        LEFT JOIN products p
        ON c.id = p.prod_category_id
        GROUP BY c.id
    `;

    db.query(sql, (err, result)=>{
        if(err) return res.status(500).json(err);
        res.json(result);
    });
};

// Remove category
export const removeCategory = (req, res) => {
  const categoryId = req.params.id;

  const sql = "DELETE FROM productcategories WHERE id = ?";

  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Category deleted",
    });
  });
};