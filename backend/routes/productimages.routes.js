import express from "express";
import {
    addProductImage,
    getProductImages,
    getAllProductImages,
    updateProductImage,
    deleteProductImage
} from "../controllers/productImage.controller.js"
const router = express.Router();
import multer from "multer";

// storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/product-images",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "image_2", maxCount: 1 },
    { name: "image_3", maxCount: 1 },
    { name: "image_4", maxCount: 1 },
    { name: "image_5", maxCount: 1 },
  ]),
  addProductImage
);
router.get("/product-images/:productId", getProductImages);
router.get("/product-images/:productId", getAllProductImages);
router.put("/product-images/:productId", updateProductImage);
router.delete("/product-images/:productId", deleteProductImage);

export default router;