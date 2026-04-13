import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../models/product.model.js";

// ✅ ADD PRODUCT
// export const addProduct = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       minprice,
//       actualprice,
//       maxprice,
//       category_id,
//       quantity,
//       prod_badgeName,
//     } = req.body;

//     const image = req.file?.filename;

//     const result = await createProduct([
//       title,
//       description,
//       minprice,
//       actualprice,
//       maxprice,
//       category_id,
//       quantity,
//       image,
//       prod_badgeName
//     ]);

//     res.json({
//       message: "Product Created",
//       id: result.insertId,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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

// ✅ FETCH ALL PRODUCTS
export const fetchProducts = async (req, res) => {
  try {
    const data = await getAllProducts(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ FETCH SINGLE PRODUCT
export const fetchProduct = async (req, res) => {
  try {
    const data = await getProductById(req.params.id);

    if (data.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ REMOVE PRODUCT
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