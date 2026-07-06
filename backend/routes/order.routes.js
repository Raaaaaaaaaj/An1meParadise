import express from "express";
import {
  editOrder,
  fetchAdminOrders,
  fetchUserOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/user/orders/:user_id", fetchUserOrders);
router.get("/admin/orders", fetchAdminOrders);
router.put("/admin/orders/:id", editOrder);

export default router;
