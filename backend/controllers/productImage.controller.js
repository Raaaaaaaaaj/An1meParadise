// controllers/productImage.controller.js

import ProductImage from "../models/productImage.model.js";

// CREATE
export const addProductImage = async (req, res) => {
  try {
    const files = req.files;

    // validation
    if (
      !files.thumbnail ||
      !files.image_2 ||
      !files.image_3 ||
      !files.image_4 ||
      !files.image_5
    ) {
      return res.status(400).json({
        success: false,
        message: "All 5 images are required",
      });
    }

    const data = {
      product_id: req.body.product_id,
      thumbnail_image: files.thumbnail[0].filename,
      image_2: files.image_2[0].filename,
      image_3: files.image_3[0].filename,
      image_4: files.image_4[0].filename,
      image_5: files.image_5[0].filename,
    };

    const result = await ProductImage.insertProductImage(data);

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
    const data = req.body;

    const exists = await ProductImage.exists(productId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Product images not found",
      });
    }

    const result = await ProductImage.updateProductImage(productId, data);

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