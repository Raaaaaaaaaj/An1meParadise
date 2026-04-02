import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { userName, userMail, userMobile, userCity, userPass } = req.body;

    // validation
    if (!userName || !userMail || !userMobile || !userPass) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check existing email
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE userMail = ?",
      [userMail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already registered ❌",
      });
    }

    // hash password
    const hashedPass = await bcrypt.hash(userPass, 10);

    // generate userCode
    const userCode = uuidv4();

    const sql = `
      INSERT INTO users 
      (userName, userMail, userMobile, userCity, userPass, userCode) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      userName,
      userMail,
      userMobile,
      userCity,
      hashedPass,
      userCode,
    ]);

    res.status(201).json({
      message: "User registered successfully ✅",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { userMail, userPass } = req.body;

    if (!userMail || !userPass) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [result] = await db.query(
      "SELECT * FROM users WHERE userMail = ?",
      [userMail]
    );

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    // password compare
    const isMatch = await bcrypt.compare(userPass, user.userPass);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT token
    const token = jwt.sign(
      {
        id: user.userId,
        email: user.userMail,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user.userId,
        name: user.userName,
        email: user.userMail,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
  try {
    console.log("🚪 USER LOGGED OUT");

    res.status(200).json({
      message: "Logout successful ✅",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};