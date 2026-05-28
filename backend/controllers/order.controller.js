import {
  getAllOrders,
  getOrdersByUserId,
  updateOrder,
} from "../models/order.model.js";

export const fetchUserOrders = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID required" });
    }

    const orders = await getOrdersByUserId(user_id);
    res.json({ orders });
  } catch (err) {
    console.error("GET USER ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const fetchAdminOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json({ orders });
  } catch (err) {
    console.error("GET ADMIN ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const editOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateOrder(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found or no changes provided" });
    }

    res.json({ message: "Order updated" });
  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
