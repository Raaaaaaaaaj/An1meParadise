import { db } from "../config/db.js"

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

export const getCategories = (req, res) => {
  db.query("SELECT * FROM productcategories", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};