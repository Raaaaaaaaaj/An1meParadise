import express from "express";
import {
  addCartItem,
  fetchCart,
  updateCart,
  deleteCartItem,
  clearUserCart,
} from "../controllers/cart.controller.js";

const router = express.Router();


// ✅ ADD TO CART
router.post("/cart", addCartItem);


// ✅ GET CART BY USER
router.get("/cart/:user_id", fetchCart);


// ✅ UPDATE QUANTITY
router.put("/cart/:id", updateCart);


// ✅ REMOVE SINGLE ITEM
router.delete("/cart/:id", deleteCartItem);


// ✅ CLEAR FULL CART
router.delete("/cart/user/:user_id", clearUserCart);


export default router;