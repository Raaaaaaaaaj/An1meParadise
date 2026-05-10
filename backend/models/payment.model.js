import { db } from "../config/db.js";

export const savePayment = async (data) => {
  const sql = `
    INSERT INTO payments
    (razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, status, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  const params = [
    data.razorpay_order_id,
    data.razorpay_payment_id,
    data.razorpay_signature,
    data.amount || null,
    data.currency || null,
    data.status || 'paid',
    data.metadata ? JSON.stringify(data.metadata) : null,
  ];

  const [result] = await db.query(sql, params);
  return result;
};

export const getPaymentByOrderId = async (order_id) => {
  const sql = `SELECT * FROM payments WHERE razorpay_order_id = ? LIMIT 1`;
  const [rows] = await db.query(sql, [order_id]);
  return rows[0];
};
