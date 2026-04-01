import {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct
} from "../models/product.model.js"
// Add product
export const addProduct = (req, res) => {
    const {
      title, 
      description, 
      minprice, 
      actualprice, 
      maxprice, 
      category_id,
      quantity
    } = req.body;
    const image = req.file?.filename;
    
    createProduct(
        [title, description, minprice, actualprice, maxprice, category_id, quantity, image],
        (err, result) => {
            if(err) return res.status(500).json(err);
            res.json({
              message: "Product Created", 
              id: result.insertId
            });
        }
    );
};
// Fecth all products
export const fetchProducts = (req, res) => {
  getAllProducts((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
};
// Fetch one pruduct
export const fetchProduct = (req, res) => {
  getProductById(req.params.id, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data[0]);
  });
};
// Remove product
export const removeProduct = (req, res) => {
  deleteProduct(req.params.id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product deleted" });
  });
};