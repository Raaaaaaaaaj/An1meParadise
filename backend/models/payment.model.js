import { db } from "../config/db.js";

export const savePayment = async (data) => {
  const sql = `
    INSERT INTO payments
    (razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const params = [
    data.razorpay_order_id,
    data.razorpay_payment_id,
    data.razorpay_signature,
    data.amount || null,
    data.currency || null,
    data.status || 'paid',
  ];

  const [result] = await db.query(sql, params);
  return result;
};
