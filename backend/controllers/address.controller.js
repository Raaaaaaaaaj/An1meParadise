import { db } from "../config/db.js";
import {
  addAddress,
  getAddressByUser,
  updateAddress,
  deleteAddress,
} from "../models/address.model.js";


// ✅ ADD ADDRESS (AUTO ACTIVE + OLD INACTIVE)
export const createAddress = async (req, res) => {

  console.log("API HIT"); 
  
  try {
    const {
      user_id,
      pincode,
      house_no,
      strt_add,
      landmark,
      state,
      type,
      name,
      phNum,
    } = req.body;

    // 🔥 Step 1: Sab addresses inactive karo
    await db.query(
      `UPDATE useraddress SET status = 'Inactive' WHERE user_id = ?`,
      [user_id]
    );

    // 🔥 Step 2: Naya address Active ke saath add karo
    const result = await addAddress([
      user_id,
      pincode,
      house_no,
      strt_add,
      landmark,
      state,
      type,
      "Active",
      name,
      phNum,
    ]);

    res.json({
      message: "Address added & set as default",
      id: result.insertId,
    });
  } catch (err) {
    console.log("ERROR:", err);   // 👈 YAHAN add kar
    console.log("ERROR: NOT intserted");   // 👈 YAHAN add kar
  res.status(500).json({ message: err.message });
  }
};


// ✅ GET USER ADDRESSES
export const fetchAddress = async (req, res) => {
  try {
    const { user_id } = req.params;

    const data = await getAddressByUser(user_id);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE ADDRESS
export const editAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      pincode,
      house_no,
      strt_add,
      landmark,
      state,
      type,
      name,
      phNum,
    } = req.body;

    await updateAddress(id, [
      pincode,
      house_no,
      strt_add,
      landmark,
      state,
      type,
      name,
      phNum,
    ]);

    res.json({
      message: "Address updated",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ DELETE ADDRESS
export const removeAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteAddress(id);

    res.json({
      message: "Address deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//✅ SET DEFAULT ADDRESS (CHECKOUT USE)
export const makeDefaultAddress = async (req, res) => {
  try {
    const { user_id, address_id } = req.body;

    // 🔥 Step 1: Sabko inactive
    await db.query(
      `UPDATE useraddress SET status = 'Inactive' WHERE user_id = ?`,
      [user_id]
    );

    // 🔥 Step 2: Selected ko active
    await db.query(
      `UPDATE useraddress SET status = 'Active' WHERE id = ? AND user_id = ?`,
      [address_id, user_id]
    );

    res.json({
      message: "Default address updated",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};