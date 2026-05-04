import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";



// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { user_id, userName, userMobile, userCity } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID required" });
    }

    // 🔍 Check user exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [user_id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update profile (email untouched)
    await db.query(
      `UPDATE users 
       SET userName = ?, userMobile = ?, userCity = ?
       WHERE id = ?`,
      [userName, userMobile, userCity, user_id]
    );

    res.json({
      message: "Profile updated successfully ✅",
    });
  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
      const { user_id, currentPassword, newPassword } = req.body;
  
      if (!user_id || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields required" });
      }
  
      // 🔍 Get user
      const [result] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [user_id]
      );
  
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const user = result[0];
  
      // 🔐 Check current password
      const isMatch = await bcrypt.compare(
        currentPassword,
        user.userPass
      );
  
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect ❌",
        });
      }
  
      // 🔒 Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // ✅ Update password
      await db.query(
        "UPDATE users SET userPass = ? WHERE id = ?",
        [hashedPassword, user_id]
      );
  
      res.json({
        message: "Password updated successfully ✅",
      });
    } catch (err) {
      console.log("CHANGE PASSWORD ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  };



  // ===============================
// ✅ GET USER PROFILE
// ===============================
export const getUserProfile = async (req, res) => {
  try {
    const { user_id } = req.params;

    const [result] = await db.query(
      "SELECT id, userName, userMail, userMobile, userCity FROM users WHERE id = ?",
      [user_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.log("GET PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};