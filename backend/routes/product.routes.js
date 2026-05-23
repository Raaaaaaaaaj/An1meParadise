import express from "express";
import {
    addProduct,
    editProduct,
    fetchProducts,
    fetchProduct,
    removeProduct,
    productCount
} from "../controllers/product.controller.js"
import multer from "multer"
import fs from "fs";
import path from "path";

const router = express.Router()

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedTypes.test(file.mimetype);

    if (extOk && mimeOk) {
        cb(null, true);
        return;
    }

    cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed"));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 8 * 1024 * 1024 },
});

const productImageFields = upload.fields([
    { name: "thumbnail_image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
    { name: "image_3", maxCount: 1 },
    { name: "image_4", maxCount: 1 },
    { name: "image_5", maxCount: 1 },
]);

// Upload product
router.post("/admin/product", productImageFields, addProduct);

// Update Product
router.put("/admin/product/:id", productImageFields, editProduct);

// Fetch all products
router.get("/products", fetchProducts);

// Fetch product By ID
router.get("/product/:id", fetchProduct);

// Remove Product
router.delete("/admin/product/:id", removeProduct);

// Get Product Count
router.get("/productCountForCRM", productCount)

export default router;
