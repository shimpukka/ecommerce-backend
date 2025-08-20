import express from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/cart/add
router.post("/add", authenticateToken, addToCart);

export default router;
