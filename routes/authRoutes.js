import express from 'express';
import { register, login, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/signup', register);
router.post('/login', login);
router.put('/update-password', protect, updatePassword);

export default router;