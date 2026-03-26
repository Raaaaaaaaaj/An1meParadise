const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { userName, userMail, userMobile, userCity, userPass } = req.body;

    // 1️⃣ validation
    if (!userName || !userMail || !userMobile || !userPass) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2️⃣ check existing user
    db.query(
      "SELECT * FROM users WHERE userMail = ?",
      [userMail],
      async (err, result) => {
        if (result.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        // 3️⃣ password hash
        const hashedPass = await bcrypt.hash(userPass, 10);

        // 4️⃣ insert user
        const sql = `
          INSERT INTO users 
          (userName, userMail, userMobile, userCity, userPass, userCode) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        // const userCode = "USR_" + Date.now();
        const userCode = uuidv4();

        db.query(
          sql,
          [userName, userMail, userMobile, userCity, hashedPass, userCode],
          (err, result) => {
            if (err) {
              return res.status(500).json({ message: err.message });
            }

            if (result.length > 0) {
              return res.status(400).json({ message: "User already exists" });
            }

            res.json({
              message: "User registered successfully ✅",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = (req, res) => {
  try {
    const { userMail, userPass } = req.body;

    if (!userMail || !userPass) {
      return res.status(400).json({ message: "All fields required" });
    }

    // user check
    db.query(
      "SELECT * FROM users WHERE userMail = ?",
      [userMail],
      async (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (result.length === 0) {
          return res.status(400).json({ message: "User not found" });
        }

        const user = result[0];

        // password compare
        const isMatch = await bcrypt.compare(userPass, user.userPass);

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔐 JWT token
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
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};