// src/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js'; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/', (req, res) => {
  res.json({ message: 'List of users' });
});

export default router;
