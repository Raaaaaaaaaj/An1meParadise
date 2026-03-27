import { db } from "../config/db.js";

export const createProduct = (data, callback) => {
    const sql = `
        INSERT INTO products (productTitle, productDescription, productMinPrice, productActualPrice, productMaxPrice, produdtcCategory, productQty, productImage)
        Values (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, data, callback);
};
export const getAllProducts = (callback) => {
    db.query ("SELECT * FROM products", callback);
};
export const getProductById = (id, callback) => {
    db.query("SELECT * FROM products WHERE id = ?", [id], callback);
};
export const deleteProduct = (id, callback) => {
    db.query("DELETE FROM products WHERE id = ?", [id], callback);
};