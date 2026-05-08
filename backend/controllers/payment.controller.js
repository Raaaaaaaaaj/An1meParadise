import Razorpay from "razorpay";
import crypto from "crypto";
import { savePayment } from "../models/payment.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
export async function createOrder(req, res) {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ message: "Amount (in paise) is required" });
    }

    if (amount < 100) {
      return res.status(400).json({ message: "Minimum amount is 100 paise" });
    }

    const options = {
      amount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.json({ order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("Create order error:", err);
    if (err.statusCode === 401) {
      return res.status(401).json({ message: "Razorpay authentication failed" });
    }
    return res.status(500).json({ message: "Failed to create order" });
  }
}

// Verify Payment
export async function verifyPayment(req, res) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // persist payment record (best-effort)
      try {
        await savePayment({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: "paid",
        });
      } catch (dbErr) {
        console.error("Failed to save payment:", dbErr.message || dbErr);
      }

      return res.json({ success: true, message: "Payment verified" });
    }

    return res.status(400).json({ success: false, message: "Signature mismatch" });
  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
}
