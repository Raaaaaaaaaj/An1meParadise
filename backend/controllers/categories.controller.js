import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../config/db.js";
import { getCategoryCount } from "../models/categories.model.js";

const uploadDir = "uploads";
const uploadRoot = path.resolve(uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const isMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && allowedTypes.test(file.mimetype);

  if (isMatch) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed!"), false);
};

export const uploadCategoryImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("category_image");

const removeUploadedFile = (file) => {
  try {
    if (file?.path) fs.unlinkSync(file.path);
  } catch (err) {
    console.error("Failed to remove uploaded category image:", err.message);
  }
};

const getStoredImagePath = (storedValue) => {
  if (!storedValue || /^https?:\/\//i.test(storedValue)) return null;

  const cleanValue = storedValue
    .replace(/\\/g, "/")
    .replace(/^\/?uploads\//, "");
  const filePath = path.resolve(uploadRoot, cleanValue);
  const relativePath = path.relative(uploadRoot, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
};

const removeStoredImage = (storedValue) => {
  const filePath = getStoredImagePath(storedValue);

  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Failed to remove stored category image:", err.message);
  }
};

// ADD CATEGORY
export const addCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      removeUploadedFile(req.file);
      return res.status(400).json({ message: "Category name is required" });
    }

    const category_image = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO productcategories (category_name, category_image)
      VALUES (?, ?)
    `;

    const [result] = await db.query(sql, [category_name, category_image]);

    res.json({
      message: "Category added successfully",
      id: result.insertId,
    });
  } catch (err) {
    removeUploadedFile(req.file);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { category_name } = req.body;
    const category_image = req.file ? req.file.filename : null;

    if (!category_name && !category_image) {
      return res.status(400).json({
        message: "At least one field (name or image file) is required to update",
      });
    }

    const fields = [];
    const values = [];
    let previousCategoryImage = null;

    if (category_name) {
      fields.push("category_name = ?");
      values.push(category_name);
    }

    if (category_image) {
      const [existingRows] = await db.query("SELECT category_image FROM productcategories WHERE id = ?", [categoryId]);

      if (existingRows.length === 0) {
        removeUploadedFile(req.file);
        return res.status(404).json({ message: "Category not found" });
      }

      fields.push("category_image = ?");
      values.push(category_image);
      previousCategoryImage = existingRows[0]?.category_image;
    }

    const sql = `
      UPDATE productcategories
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    values.push(categoryId);

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      removeUploadedFile(req.file);
      return res.status(404).json({ message: "Category not found" });
    }

    if (category_image) {
      removeStoredImage(previousCategoryImage);
    }

    res.json({
      message: "Category updated successfully",
    });
  } catch (err) {
    removeUploadedFile(req.file);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM productcategories");
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CATEGORY WITH PRODUCT COUNT
export const getCategoriesWithCount = async (req, res) => {
  try {
    const sql = `
      SELECT
        c.id,
        c.category_name,
        c.category_image,
        COUNT(p.id) AS total_products
      FROM productcategories c
      LEFT JOIN products p ON c.id = p.prod_category_ID
      GROUP BY c.id, c.category_name, c.category_image
    `;
    const [result] = await db.query(sql);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE CATEGORY
export const removeCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const [existingRows] = await db.query("SELECT category_image FROM productcategories WHERE id = ?", [categoryId]);
    const [result] = await db.query("DELETE FROM productcategories WHERE id = ?", [categoryId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    removeStoredImage(existingRows[0]?.category_image);

    res.json({
      message: "Category deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CATEGORIES COUNT FOR CRM
export const categoryCount = async (req, res) => {
  try {
    const totalCategories = await getCategoryCount();
    res.json({ totalCategories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
