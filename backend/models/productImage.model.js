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

  static async updateProductImagePartial(productId, data) {
    const fields = [];
    const values = [];

    for (const key of ["thumbnail_image", "image_2", "image_3", "image_4", "image_5"]) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        fields.push(`${key} = ?`);
        values.push(data[key] || null);
      }
    }

    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    values.push(productId);

    const sql = `
      UPDATE productimage
      SET ${fields.join(", ")}
      WHERE product_id = ?
    `;

    const [result] = await db.execute(sql, values);
    return result;
  }

  static async upsertProductImage(productId, data) {
    const exists = await this.exists(productId);

    if (exists) {
      return this.updateProductImagePartial(productId, data);
    }

    return this.insertProductImage({
      product_id: productId,
      thumbnail_image: data.thumbnail_image || null,
      image_2: data.image_2 || null,
      image_3: data.image_3 || null,
      image_4: data.image_4 || null,
      image_5: data.image_5 || null,
    });
  }

  // DELETE
  static async deleteProductImage(productId) {
    const sql = `DELETE FROM productimage WHERE product_id = ?`;
    const [result] = await db.execute(sql, [productId]);
    return result;
  }
}

export default ProductImage;
