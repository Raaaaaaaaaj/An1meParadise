import express from "express";
import {
    addProduct,
    fetchProducts,
    fetchProduct,
    removeProduct,
    productCount
} from "../controllers/product.controller.js"
import multer from "multer"

const router = express.Router()

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});
const upload = multer({storage});

// Upload product
router.post("/admin/product", upload.single("image"), addProduct);

// Fetch all products
router.get("/products", fetchProducts);

// Fetch product By ID
router.get("/product/:id", fetchProduct);

// Remove Product
router.delete("/admin/product/:id", removeProduct);

// Get Product Count
router.get("/productCountForCRM", productCount)

export default router;
