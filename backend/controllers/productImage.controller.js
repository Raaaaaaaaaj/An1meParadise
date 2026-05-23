// controllers/productImage.controller.js

import ProductImage from "../models/productImage.model.js";

const firstUploadedFilename = (files, keys) => {
  for (const key of keys) {
    const filename = files?.[key]?.[0]?.filename;
    if (filename) return filename;
  }

  return null;
};

const getUploadedImageData = (files) => {
  const thumbnail = firstUploadedFilename(files, ["thumbnail_image", "thumbnail"]);

  return {
    ...(thumbnail ? { thumbnail_image: thumbnail } : {}),
    ...(files?.image_2?.[0]?.filename ? { image_2: files.image_2[0].filename } : {}),
    ...(files?.image_3?.[0]?.filename ? { image_3: files.image_3[0].filename } : {}),
    ...(files?.image_4?.[0]?.filename ? { image_4: files.image_4[0].filename } : {}),
    ...(files?.image_5?.[0]?.filename ? { image_5: files.image_5[0].filename } : {}),
  };
};

// CREATE
export const addProductImage = async (req, res) => {
  try {
    const files = req.files;
    const data = getUploadedImageData(files);

    if (!data.thumbnail_image) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    const result = await ProductImage.insertProductImage({
      product_id: req.body.product_id,
      thumbnail_image: data.thumbnail_image,
      image_2: data.image_2 || null,
      image_3: data.image_3 || null,
      image_4: data.image_4 || null,
      image_5: data.image_5 || null,
    });

    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET BY PRODUCT ID
export const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = await ProductImage.findImageByProductId(productId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No images found",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL
export const getAllProductImages = async (req, res) => {
  try {
    const data = await ProductImage.findAllProductImages();

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE
export const updateProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = getUploadedImageData(req.files);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image file is required",
      });
    }

    const result = await ProductImage.upsertProductImage(productId, data);

    return res.json({
      success: true,
      message: "Updated successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE
export const deleteProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const exists = await ProductImage.exists(productId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Product images not found",
      });
    }

    await ProductImage.deleteProductImage(productId);

    return res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
