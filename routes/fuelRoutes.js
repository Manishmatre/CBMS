import express from 'express';
import { 
  createFuelPurchase,
  createFuelConsumption,
  getFuelRecords,
} from '../controllers/fuelController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Fuel purchase routes
router.post('/purchase', 
  protect, 
  upload.single('receiptPhoto'), 
  createFuelPurchase
);
router.get('/purchase', protect, getFuelRecords);

// Fuel consumption routes
router.post('/consumption', 
  protect, 
  upload.single('receiptPhoto'), 
  createFuelConsumption
);
router.get('/consumption', protect, getFuelRecords);

export default router;
