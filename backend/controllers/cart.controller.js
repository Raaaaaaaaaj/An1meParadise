import {
    addToCart,
    getCartByUser,
    updateCartItem,
    removeCartItem,
    clearCart,
  } from "../models/cart.model.js";
  
  
  // ✅ ADD TO CART
  export const addCartItem = async (req, res) => {
    try {
      const { user_id, product_id, quantity, size, price_at_time } = req.body;
  
      const result = await addToCart([
        user_id,
        product_id,
        quantity || 1,
        size || null,
        price_at_time,
      ]);
  
      res.json({
        message: "Item added to cart",
        id: result.insertId,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  
  // ✅ GET CART BY USER
  export const fetchCart = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const data = await getCartByUser(user_id);
  
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  
  // ✅ UPDATE QUANTITY
  export const updateCart = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      await updateCartItem(id, quantity);
  
      res.json({
        message: "Cart updated",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  
  // ✅ REMOVE SINGLE ITEM
  export const deleteCartItem = async (req, res) => {
    try {
      const { id } = req.params;
  
      await removeCartItem(id);
  
      res.json({
        message: "Item removed from cart",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  
  
  // ✅ CLEAR FULL CART
  export const clearUserCart = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      await clearCart(user_id);
  
      res.json({
        message: "Cart cleared",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };