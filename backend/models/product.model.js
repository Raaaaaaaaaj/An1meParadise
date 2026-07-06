import { db } from "../config/db.js";

// CREATE PRODUCT (Updated)
export const createProduct = async (data) => {
  const sql = `
    INSERT INTO products 
    (prod_title, prod_description, prod_minPrice, prod_actualPrice, prod_maxPrice, prod_category_ID, prod_qty, prod_badgeName, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, data);
  return result; // Isme insertId hota hai
};

// Function for entering new images
export const addProductImage = async (productId, filename) => {
  const sql = `INSERT INTO productimage (product_id, thumbnail_image) VALUES (?, ?)`;
  await db.query(sql, [productId, filename]);
};

// GET ALL PRODUCTS (JOIN + FILTER + SORT)
export const getAllProducts = async (query = {}) => {
  const { category, sort, search, featured, page, limit } = query;

  const baseWhere = [];
  const params = [];

  if (featured === "true") {
    baseWhere.push("p.is_featured = 1");
  }

  if (category && category !== "All") {
    baseWhere.push("c.category_name = ?");
    params.push(category);
  }

  if (search) {
    baseWhere.push("p.prod_title LIKE ?");
    params.push(`%${search}%`);
  }

  const whereClause = baseWhere.length > 0 ? `WHERE ${baseWhere.join(" AND ")}` : "WHERE 1=1";

  const countSql = `
    SELECT COUNT(*) AS total
    FROM products p
    LEFT JOIN productcategories c ON p.prod_category_ID = c.id
    ${whereClause}
  `;

  const [countRows] = await db.query(countSql, params);
  const total = Number(countRows?.[0]?.total || 0);

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Number(limit) || 20);
  const offset = (pageNumber - 1) * pageSize;

  let sql = `
    SELECT 
      p.id,
      p.prod_title,
      p.prod_description,
      p.prod_minPrice,
      p.prod_actualPrice,
      p.prod_maxPrice,
      p.prod_qty,
      p.prod_createdAt,
      p.prod_category_ID,
      p.prod_badgeName,
      p.is_featured,
      c.category_name,
      pi.thumbnail_image AS image,
      pi.thumbnail_image,
      pi.image_2,
      pi.image_3,
      pi.image_4,
      pi.image_5
    FROM products p
    LEFT JOIN productcategories c 
      ON p.prod_category_ID = c.id
    LEFT JOIN (
      SELECT
        product_id,
        MIN(thumbnail_image) AS thumbnail_image,
        MIN(image_2) AS image_2,
        MIN(image_3) AS image_3,
        MIN(image_4) AS image_4,
        MIN(image_5) AS image_5
      FROM productimage
      GROUP BY product_id
    ) pi ON p.id = pi.product_id
    ${whereClause}
  `;

  if (sort === "low") {
    sql += " ORDER BY p.prod_actualPrice ASC";
  } else if (sort === "high") {
    sql += " ORDER BY p.prod_actualPrice DESC";
  } else if (sort === "latest") {
    sql += " ORDER BY p.id DESC";
  }

  if (page || limit) {
    sql += " LIMIT ? OFFSET ?";
    params.push(pageSize, offset);
  }

  const [rows] = await db.query(sql, params);

  if (page || limit) {
    return {
      data: rows,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  return rows;
};

// UPDATE PRODUCT
export const updateProduct = async (id, data) => {
  const fields = [];
  const values = [];

  const columnMap = {
    prod_title: "prod_title",
    prod_description: "prod_description",
    prod_minPrice: "prod_minPrice",
    prod_actualPrice: "prod_actualPrice",
    prod_maxPrice: "prod_maxPrice",
    prod_category_ID: "prod_category_ID",
    prod_qty: "prod_qty",
    prod_badgeName: "prod_badgeName",
    is_featured: "is_featured",
  };

  Object.entries(columnMap).forEach(([key, column]) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      fields.push(`${column} = ?`);
      values.push(data[key]);
    }
  });

  if (fields.length === 0) {
    return { affectedRows: 0 };
  }

  values.push(id);

  const sql = `
    UPDATE products
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  const [result] = await db.query(sql, values);
  return result;
};

// GET PRODUCT BY ID (WITH JOIN)
export const getProductById = async (id) => {
  const sql = `
    SELECT 
  p.*,
  c.category_name,
  JSON_ARRAY(
    pi.thumbnail_image,
    pi.image_2,
    pi.image_3,
    pi.image_4,
    pi.image_5
  ) AS images
FROM products p
LEFT JOIN productcategories c 
  ON p.prod_category_ID = c.id
LEFT JOIN productimage pi 
  ON p.id = pi.product_id
WHERE p.id = ?
  `;
  const [rows] = await db.query(sql, [id]);
  return rows;
};

// DELETE PRODUCT
export const deleteProduct = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result;
};

// Get Products Count for - CRM
export const getProductCount = async() => {
  const sql = `
    SELECT COUNT(*) AS productCount FROM products
  `
  const [rows] = await db.query(sql);
  return rows[0].productCount;
}
