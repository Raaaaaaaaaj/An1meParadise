import { db } from "../config/db.js";

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const formatAddress = (addr) => {
  if (!addr) return null;
  if (typeof addr === "string") return addr;

  const parts = [
    addr.name,
    addr.phNum || addr.phone || addr.mobile,
    addr.house_no,
    addr.strt_add,
    addr.landmark,
    addr.state,
    addr.pincode,
  ].filter(Boolean);

  return parts.join(", ");
};

const normalizeItems = (items = []) =>
  items
    .map((item) => {
      const productId = toNumber(item.product_id || item.productId || item.id || item.product?.id);
      const quantity = Math.max(1, toNumber(item.quantity || item.qty, 1));
      const priceAtTime = toNumber(item.price_at_time || item.price || item.product?.prod_actualPrice);

      return {
        product_id: productId,
        quantity,
        price_at_time: priceAtTime,
        total_price: toNumber(item.total_price, priceAtTime * quantity),
      };
    })
    .filter((item) => item.product_id > 0 && item.price_at_time >= 0);

export const createOrderFromPayment = async ({
  user_id,
  total_amount,
  shipping_charge,
  final_amount,
  billing_address,
  razorpay_payment_id,
  razorpay_order_id,
  items,
}) => {
  const normalizedItems = normalizeItems(items);

  if (!user_id) {
    throw new Error("User ID is required to create order");
  }

  if (normalizedItems.length === 0) {
    throw new Error("At least one order item is required");
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT id FROM orders WHERE razorpay_order_id = ? LIMIT 1",
      [razorpay_order_id]
    );

    if (existing.length > 0) {
      await connection.commit();
      return { id: existing[0].id, alreadyExists: true };
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (user_id, order_status, total_amount, shipping_charge, final_amount, billing_address, razorpay_payment_id, razorpay_order_id)
       VALUES (?, 'confirmed', ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        toNumber(total_amount),
        toNumber(shipping_charge),
        toNumber(final_amount),
        billing_address || null,
        razorpay_payment_id,
        razorpay_order_id,
      ]
    );

    const orderId = orderResult.insertId;
    const itemValues = normalizedItems.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price_at_time,
      item.total_price,
    ]);

    await connection.query(
      `INSERT INTO order_items
       (order_id, product_id, quantity, price_at_time, total_price)
       VALUES ?`,
      [itemValues]
    );

    await connection.commit();
    return { id: orderId, alreadyExists: false };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const buildOrderDataFromMetadata = ({
  razorpay_payment_id,
  razorpay_order_id,
  metadata = {},
}) => {
  const totalAmount = toNumber(metadata.total_amount);
  const finalAmount = toNumber(metadata.final_amount);
  const shippingCharge = toNumber(metadata.shipping_charge);
  const totalFromPaise = toNumber(metadata.total || metadata.amount) / 100;

  return {
    user_id: metadata.user_id || metadata.buyer?.id,
    total_amount: totalAmount || Math.max(0, finalAmount - shippingCharge) || totalFromPaise,
    shipping_charge: shippingCharge,
    final_amount: finalAmount || totalFromPaise + shippingCharge,
    billing_address: metadata.billing_address || formatAddress(metadata.address),
    razorpay_payment_id,
    razorpay_order_id,
    items: metadata.items || [],
  };
};

export const getOrdersByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT
       o.id,
       o.user_id,
       o.order_status,
       o.total_amount,
       o.shipping_charge,
       o.final_amount,
       o.billing_address,
       o.created_at,
       o.razorpay_payment_id,
       o.razorpay_order_id,
       oi.id AS item_id,
       oi.product_id,
       oi.quantity,
       oi.price_at_time,
       oi.total_price,
       p.prod_title,
       pi.thumbnail_image
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN products p ON p.id = oi.product_id
     LEFT JOIN (
       SELECT product_id, MIN(thumbnail_image) AS thumbnail_image
       FROM productimage
       GROUP BY product_id
     ) pi ON pi.product_id = oi.product_id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC, o.id DESC`,
    [userId]
  );

  return groupOrderRows(rows);
};

export const getAllOrders = async () => {
  const [rows] = await db.query(
    `SELECT
       o.id,
       o.user_id,
       u.userName,
       u.userMail,
       o.order_status,
       o.total_amount,
       o.shipping_charge,
       o.final_amount,
       o.billing_address,
       o.created_at,
       o.razorpay_payment_id,
       o.razorpay_order_id,
       oi.id AS item_id,
       oi.product_id,
       oi.quantity,
       oi.price_at_time,
       oi.total_price,
       p.prod_title
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     LEFT JOIN products p ON p.id = oi.product_id
     ORDER BY o.created_at DESC, o.id DESC`
  );

  return groupOrderRows(rows);
};

export const updateOrder = async (id, data) => {
  const fields = [];
  const values = [];

  if (data.order_status) {
    fields.push("order_status = ?");
    values.push(String(data.order_status).toLowerCase());
  }

  if (Object.prototype.hasOwnProperty.call(data, "billing_address")) {
    fields.push("billing_address = ?");
    values.push(data.billing_address || null);
  }

  if (fields.length === 0) return { affectedRows: 0 };

  values.push(id);
  const [result] = await db.query(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`, values);
  return result;
};

const groupOrderRows = (rows) => {
  const orderMap = new Map();

  rows.forEach((row) => {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id,
        user_id: row.user_id,
        userName: row.userName,
        userMail: row.userMail,
        order_status: row.order_status,
        total_amount: Number(row.total_amount || 0),
        shipping_charge: Number(row.shipping_charge || 0),
        final_amount: Number(row.final_amount || 0),
        billing_address: row.billing_address || "",
        created_at: row.created_at,
        razorpay_payment_id: row.razorpay_payment_id || "",
        razorpay_order_id: row.razorpay_order_id || "",
        items: [],
      });
    }

    if (row.item_id) {
      orderMap.get(row.id).items.push({
        id: row.item_id,
        product_id: row.product_id,
        product_name: row.prod_title || `Product #${row.product_id}`,
        quantity: row.quantity,
        price_at_time: Number(row.price_at_time || 0),
        total_price: Number(row.total_price || 0),
        thumbnail_image: row.thumbnail_image || null,
      });
    }
  });

  return Array.from(orderMap.values());
};
