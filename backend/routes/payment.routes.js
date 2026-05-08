import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";

const router = express.Router();

// Create Razorpay order
router.post("/create-order", createOrder);

// Verify payment signature
router.post("/verify-payment", verifyPayment);

export default router;
