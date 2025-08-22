import express from "express";
import { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "../controllers/cart.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// POST /api/cart/add - Add product to cart
router.post("/add", addToCart);

// GET /api/cart - Get user's cart items
router.get("/", getCart);

// PUT /api/cart/:id - Update cart item quantity
router.put("/:id", updateCartItem);

// DELETE /api/cart/:id - Remove item from cart
router.delete("/:id", removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete("/", clearCart);

export default router;
