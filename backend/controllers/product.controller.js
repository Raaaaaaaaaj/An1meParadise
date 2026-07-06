import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductCount
} from "../models/product.model.js";
import ProductImage from "../models/productImage.model.js";
import fs from "fs";
import path from "path";

const uploadRoot = path.resolve("uploads");

const numberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
};

const textOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  return value;
};

const firstDefined = (body, keys) => {
  for (const key of keys) {
    if (body[key] !== undefined) return body[key];
  }

  return undefined;
};

const normalizeProductBody = (body) => {
  const data = {};

  const fieldMap = {
    prod_title: ["prod_title", "title"],
    prod_description: ["prod_description", "description"],
    prod_minPrice: ["prod_minPrice", "minprice", "prod_mainPrice"],
    prod_actualPrice: ["prod_actualPrice", "actualprice"],
    prod_maxPrice: ["prod_maxPrice", "maxprice"],
    prod_category_ID: ["prod_category_ID", "prod_categoryId", "category_id"],
    prod_qty: ["prod_qty", "quantity", "prod_quantity"],
    prod_badgeName: ["prod_badgeName"],
    is_featured: ["is_featured"],
  };

  Object.entries(fieldMap).forEach(([field, aliases]) => {
    const value = firstDefined(body, aliases);

    if (value === undefined) return;

    if (
      field === "prod_minPrice" ||
      field === "prod_actualPrice" ||
      field === "prod_maxPrice" ||
      field === "prod_category_ID" ||
      field === "prod_qty" ||
      field === "is_featured"
    ) {
      data[field] = numberOrNull(value);
      return;
    }

    data[field] = textOrNull(value);
  });

  return data;
};

const firstUploadedFilename = (files, keys) => {
  for (const key of keys) {
    const filename = files?.[key]?.[0]?.filename;
    if (filename) return filename;
  }

  return null;
};

const getUploadedProductImages = (files) => {
  const data = {};
  const thumbnail = firstUploadedFilename(files, ["thumbnail_image", "thumbnail", "image"]);

  if (thumbnail) data.thumbnail_image = thumbnail;

  ["image_2", "image_3", "image_4", "image_5"].forEach((key) => {
    const filename = firstUploadedFilename(files, [key]);
    if (filename) data[key] = filename;
  });

  return data;
};

const hasAnyValue = (data) => Object.keys(data).length > 0;

const removeUploadedFiles = (files) => {
  Object.values(files || {})
    .flat()
    .forEach((file) => {
      try {
        if (file?.path) fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Failed to remove uploaded file:", err.message);
      }
    });
};

const getStoredUploadPath = (storedValue) => {
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

const removeStoredProductImages = (imageRow, fields = ["thumbnail_image", "image_2", "image_3", "image_4", "image_5"]) => {
  fields.forEach((field) => {
    const filePath = getStoredUploadPath(imageRow?.[field]);

    try {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Failed to remove stored product image:", err.message);
    }
  });
};


// Add product
export const addProduct = async (req, res) => {
  try {
    const data = normalizeProductBody(req.body);

    if (!data.prod_title) {
      removeUploadedFiles(req.files);
      return res.status(400).json({ message: "Product title is required" });
    }

    // Check product limit (max 120 products)
    const totalProducts = await getProductCount();
    if (totalProducts >= 120) {
      removeUploadedFiles(req.files);
      return res.status(400).json({ 
        message: "Product limit reached. Maximum 120 products allowed."
      });
    }

    const uploadedImages = getUploadedProductImages(req.files);

    // 1. Product insert karein (images separate table mein save hoti hain)
    const result = await createProduct([
      data.prod_title,
      data.prod_description,
      data.prod_minPrice,
      data.prod_actualPrice,
      data.prod_maxPrice,
      data.prod_category_ID,
      data.prod_qty,
      data.prod_badgeName,
      data.is_featured ?? 0,
    ]);

    const newProductId = result.insertId;

    // 2. Agar images upload hui hain, toh productimage table mein save karein
    if (hasAnyValue(uploadedImages)) {
      await ProductImage.insertProductImage({
        product_id: newProductId,
        thumbnail_image: uploadedImages.thumbnail_image || null,
        image_2: uploadedImages.image_2 || null,
        image_3: uploadedImages.image_3 || null,
        image_4: uploadedImages.image_4 || null,
        image_5: uploadedImages.image_5 || null,
      });
    }

    res.status(201).json({
      message: "Product and Image Created Successfully",
      id: newProductId,
    });
  } catch (err) {
    removeUploadedFiles(req.files);
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Fetch all products
export const fetchProducts = async (req, res) => {
  try {
    const data = await getAllProducts(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch single product
export const fetchProduct = async (req, res) => {
  try {
    const data = await getProductById(req.params.id);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = data[0];

    // ✅ images ko ALWAYS array bana do
    try {
      if (product.images) {
        // agar string hai → parse karo
        if (typeof product.images === "string") {
          product.images = JSON.parse(product.images);
        }
      } else {
        product.images = [];
      }
    } catch (error) {
      product.images = [];
    }

    // ✅ null values hatao (important)
    if (Array.isArray(product.images)) {
      product.images = product.images.filter(Boolean);
    } else {
      product.images = [];
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Fetch Product Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update product
export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = normalizeProductBody(req.body);
    const uploadedImages = getUploadedProductImages(req.files);
    const existingProduct = await getProductById(productId);

    if (!existingProduct || existingProduct.length === 0) {
      removeUploadedFiles(req.files);
      return res.status(404).json({ message: "Product not found" });
    }

    if (!hasAnyValue(data) && !hasAnyValue(uploadedImages)) {
      return res.status(400).json({ message: "At least one product field or image file is required" });
    }

    if (hasAnyValue(data)) {
      await updateProduct(productId, data);
    }

    if (hasAnyValue(uploadedImages)) {
      const previousImages = await ProductImage.findImageByProductId(productId);
      await ProductImage.upsertProductImage(productId, uploadedImages);
      removeStoredProductImages(previousImages, Object.keys(uploadedImages));
    }

    res.json({
      message: "Product updated successfully",
    });
  } catch (err) {
    removeUploadedFiles(req.files);
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Remove products
export const removeProduct = async (req, res) => {
  try {
    const existingProduct = await getProductById(req.params.id);

    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingImages = await ProductImage.findImageByProductId(req.params.id);
    await ProductImage.deleteProductImage(req.params.id);
    await deleteProduct(req.params.id);
    removeStoredProductImages(existingImages);

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Pdoruct Count for - CRM
export const productCount = async (req, res) => {
  try{
    const totalProducts = await getProductCount()
    res.json({totalProducts})
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
}
