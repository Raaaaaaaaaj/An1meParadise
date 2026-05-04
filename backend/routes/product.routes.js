import express from "express";
import {
    addProduct,
    fetchProducts,
    fetchProduct,
    fetchFeaturedProducts,
    removeProduct,
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

//routes
router.post("/admin/product", upload.single("image"), addProduct);
router.get("/products", fetchProducts);
router.get("/product/:id", fetchProduct);
router.get("/products/featured", fetchFeaturedProducts);
router.delete("/admin/product/:id", removeProduct);

export default router;
