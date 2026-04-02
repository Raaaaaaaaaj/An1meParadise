import {db} from "../config/db.js";

class ProductImage {

    // Insert product images
    static async insertProductImage(data){
        const sql = `
            INSERT INTO productimage
            (product_id, thumbnail_image, image_2, image_3, image_4, image_5) 
            VALUES(?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.product_id,
            data.thumbnail_image,
            data.image_2 || null,
            data.image_3 || null,
            data.image_4 || null,
            data.image_5 || null
        ];
        const [result] = await db.execute(sql, values);
        return result;
    }

    // Get product images by product ID
    static async findImageByProductId(productid){
        const sql = `
            SELECT * FROM productimage WHERE product_id = ?
        `;
        const [rows] = await db.execute(sql, [productid]);
        return rows[0];
    }

    // Get all product images
    static async findAllProductImages(){
        const sql = `
            SELECT * FROM productimage
        `
        const [rows] = await db.execute(sql);
        return rows;
    }

    // Update prduct image
    static async updateProductImage(productid, data){
        const sql = `
            UPDATE productimage 
            SET
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
            productid
        ];
        const result = await db.execute(sql, values);
        return result;
    }

    // Delete product image
    static async deleteProductImage(productId){
        const sql = `
            DELETE FROM productimage WHERE product_id = ?
        `;
        const result = await db.execute(sql, [productId]);
        return result;
    }
}