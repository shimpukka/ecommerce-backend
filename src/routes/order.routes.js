import express from "express";
import { checkout, getMyOrders, getAllOrders, updateOrderStatus, payOrder } from "../controllers/order.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/checkout", authenticateToken, checkout);
router.get("/my-orders", authenticateToken, getMyOrders);
router.post("/:id/pay", authenticateToken, payOrder);

// Admin only: get all orders and update order status
router.get("/all", authenticateToken, requireAdmin, getAllOrders);
router.put("/:id/status", authenticateToken, requireAdmin, updateOrderStatus);

export default router;
