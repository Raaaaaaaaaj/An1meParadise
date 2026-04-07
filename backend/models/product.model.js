import { db } from "../config/db.js";

// CREATE PRODUCT
export const createProduct = async (data) => {
  const sql = `
    INSERT INTO products 
    (prod_title, prod_description, prod_minPrice, prod_actualPrice, prod_maxPrice, prod_category_ID, prod_qty, prod_image, prod_badgeName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, data);
  return result;
};

// GET ALL PRODUCTS (JOIN + FILTER + SORT)
export const getAllProducts = async (query) => {
  let { category, sort, search } = query;

  let sql = `
    SELECT 
      p.id,
      p.prod_title,
      p.prod_description,
      p.prod_actualPrice,
      p.prod_badgeName,
      c.category_name,
      MIN(pi.thumbnail_image) AS image
    FROM products p
    LEFT JOIN productcategories c 
      ON p.prod_category_ID = c.id
    LEFT JOIN productimage pi 
      ON p.id = pi.product_id
    WHERE 1=1
  `;

  const params = [];

  // ✅ CATEGORY FILTER
  if (category && category !== "All") {
    sql += " AND c.category_name = ?";
    params.push(category);
  }

  // ✅ SEARCH FILTER
  if (search) {
    sql += " AND p.prod_title LIKE ?";
    params.push(`%${search}%`);
  }

  sql += " GROUP BY p.id";

  // ✅ SORTING
  if (sort === "low") {
    sql += " ORDER BY p.prod_actualPrice ASC";
  } else if (sort === "high") {
    sql += " ORDER BY p.prod_actualPrice DESC";
  } else if (sort === "latest") {
    sql += " ORDER BY p.id DESC";
  }

  const [rows] = await db.query(sql, params);
  return rows;
};

// GET PRODUCT BY ID (WITH JOIN)
export const getProductById = async (id) => {
  const sql = `
    SELECT 
      p.*,
      c.category_name,
      JSON_ARRAYAGG(pi.image_url) AS images
    FROM products p
    LEFT JOIN product_categories c 
      ON p.prod_category_ID = c.id
    LEFT JOIN product_images pi 
      ON p.id = pi.product_id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  const [rows] = await db.query(sql, [id]);
  return rows;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const [result] = await db.query(
    "DELETE FROM products WHERE id = ?",
    [id]
  );
  return result;
};