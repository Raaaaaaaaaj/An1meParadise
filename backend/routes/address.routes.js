import express from "express";
import {
  createAddress,
  fetchAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
} from "../controllers/address.controller.js";

const router = express.Router();


// ✅ ADD ADDRESS (auto active)
router.post("/address", createAddress);


// ✅ GET USER ADDRESSES
router.get("/address/:user_id", fetchAddress);


// ✅ UPDATE ADDRESS
router.put("/address/:id", editAddress);


// ✅ DELETE ADDRESS
router.delete("/address/:id", removeAddress);


// ✅ SET DEFAULT ADDRESS (manual select / checkout)
router.put("/address/default", makeDefaultAddress);

export default router;