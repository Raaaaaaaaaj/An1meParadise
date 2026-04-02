import { db } from "../config/db.js";

// ✅ CREATE PRODUCT
export const createProduct = async (data) => {
  const sql = `
    INSERT INTO products 
    (prod_title, prod_description, prod_minPrice, prod_actualPrice, prod_maxPrice, prod_category_ID, prod_qty, prod_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, data);
  return result;
};

// ✅ GET ALL PRODUCTS
export const getAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products");
  return rows;
};

// ✅ GET PRODUCT BY ID
export const getProductById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  return rows;
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (id) => {
  const [result] = await db.query(
    "DELETE FROM products WHERE id = ?",
    [id]
  );
  return result;
};