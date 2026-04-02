// models/productImage.model.js

import { db } from "../config/db.js";

class ProductImage {

  // CREATE
  static async insertProductImage(data) {
    const sql = `
      INSERT INTO productimage
      (product_id, thumbnail_image, image_2, image_3, image_4, image_5)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.product_id,
      data.thumbnail_image,
      data.image_2 || null,
      data.image_3 || null,
      data.image_4 || null,
      data.image_5 || null,
    ];

    const [result] = await db.execute(sql, values);
    return result;
  }

  // EXISTS CHECK
  static async exists(productId) {
    const sql = `SELECT id FROM productimage WHERE product_id = ?`;
    const [rows] = await db.execute(sql, [productId]);
    return rows.length > 0;
  }

  // GET BY ID
  static async findImageByProductId(productId) {
    const sql = `SELECT * FROM productimage WHERE product_id = ?`;
    const [rows] = await db.execute(sql, [productId]);
    return rows[0];
  }

  // GET ALL
  static async findAllProductImages() {
    const sql = `SELECT * FROM productimage`;
    const [rows] = await db.execute(sql);
    return rows;
  }

  // UPDATE
  static async updateProductImage(productId, data) {
    const sql = `
      UPDATE productimage SET
      thumbnail_image = ?,
      image_2 = ?,
      image_3 = ?,
      image_4 = ?,
      image_5 = ?
      WHERE product_id = ?
    `;

    const values = [
      data.thumbnail_image,
      data.image_2 || null,
      data.image_3 || null,
      data.image_4 || null,
      data.image_5 || null,
      productId,
    ];

    const [result] = await db.execute(sql, values);
    return result;
  }

  // DELETE
  static async deleteProductImage(productId) {
    const sql = `DELETE FROM productimage WHERE product_id = ?`;
    const [result] = await db.execute(sql, [productId]);
    return result;
  }
}

export default ProductImage;