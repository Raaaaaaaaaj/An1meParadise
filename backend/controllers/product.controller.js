import {
  createProduct,
  getAllProducts,
  getProductById,
  getFeatured,
  deleteProduct,
} from "../models/product.model.js";


// Add product
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      minprice,
      actualprice,
      maxprice,
      category_id,
      quantity,
      prod_badgeName,
    } = req.body;

    const image = req.file?.filename;

    // 1. Product insert karein (Note: image array se hata diya hai)
    const result = await createProduct([
      title,
      description,
      minprice,
      actualprice,
      maxprice,
      category_id,
      quantity,
      prod_badgeName
    ]);

    const newProductId = result.insertId;

    // 2. Agar image upload hui hai, toh usse separate table mein save karein
    if (image) {
      await addProductImage(newProductId, image);
    }

    res.status(201).json({
      message: "Product and Image Created Successfully",
      id: newProductId,
    });
  } catch (err) {
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

// Fetch Featured products
export const fetchFeaturedProducts = async (req, res) => {
  try {
    const data = await getFeatured(); // Parameter ki zaroorat nahi agar query static hai
    
    if (data.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error in fetchFeaturedProducts:", err); // Server logs ke liye
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Remove products
export const removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};