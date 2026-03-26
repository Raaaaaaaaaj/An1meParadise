const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/signup", async (req, res) => {
  console.log("Signup API hit");

  try {
    return res.status(200).json({
      message: "Signup working"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
});

router.post("/login", authController.login);

module.exports = router;