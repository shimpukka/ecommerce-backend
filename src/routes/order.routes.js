import express from "express";
import { checkout, getMyOrders, getAllOrders } from "../controllers/order.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/checkout", authenticateToken, checkout);
router.get("/my-orders", authenticateToken, getMyOrders);
router.get("/all", authenticateToken, requireAdmin, getAllOrders);

export default router;
