import express from 'express';
import { 
  createFuelPurchase,
  createFuelConsumption,
  getFuelRecords,
  deleteFuelPurchase,
  deleteFuelConsumption
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
router.delete('/purchase/:id', protect, deleteFuelPurchase);

// Fuel consumption routes
router.post('/consumption', 
  protect, 
  upload.single('receiptPhoto'), 
  createFuelConsumption
);
router.get('/consumption', protect, getFuelRecords);
router.delete('/consumption/:id', protect, deleteFuelConsumption);

export default router;
