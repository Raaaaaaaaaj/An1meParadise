import { db } from "../config/db.js";


// ✅ ADD TO CART
export const addToCart = async (data) => {
  const sql = `
    INSERT INTO cart_items 
    (user_id, product_id, quantity, size, price_at_time)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, data);
  return result;
};


// ✅ GET CART ITEMS BY USER (WITH PRODUCT DETAILS)
export const getCartByUser = async (userId) => {
  const sql = `
    SELECT 
      ci.id,
      ci.product_id,
      ci.quantity,
      ci.size,
      ci.price_at_time,
      p.prod_title,
      p.prod_actualPrice,
      MIN(pi.thumbnail_image) AS image
    FROM cart_items ci
    LEFT JOIN products p 
      ON ci.product_id = p.id
    LEFT JOIN productimage pi 
      ON p.id = pi.product_id
    WHERE ci.user_id = ?
    GROUP BY ci.id
  `;

  const [rows] = await db.query(sql, [userId]);
  return rows;
};


// ✅ UPDATE QUANTITY
export const updateCartItem = async (cartItemId, quantity) => {
  const sql = `
    UPDATE cart_items 
    SET quantity = ? 
    WHERE id = ?
  `;
  const [result] = await db.query(sql, [quantity, cartItemId]);
  return result;
};


// ✅ REMOVE SINGLE ITEM
export const removeCartItem = async (cartItemId) => {
  const sql = `
    DELETE FROM cart_items 
    WHERE id = ?
  `;
  const [result] = await db.query(sql, [cartItemId]);
  return result;
};


// ✅ CLEAR CART (ALL ITEMS OF USER)
export const clearCart = async (userId) => {
  const sql = `
    DELETE FROM cart_items 
    WHERE user_id = ?
  `;
  const [result] = await db.query(sql, [userId]);
  return result;
};