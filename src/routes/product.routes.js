// src/routes/product.routes.js
import express from 'express';

const router = express.Router();

// Example product route
router.get('/', (req, res) => {
  res.json({ message: 'List of products' });
});

export default router; // ✅ This is the default export
