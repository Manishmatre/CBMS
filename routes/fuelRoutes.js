import express from 'express';
import { createFuelPurchase, getFuelStock, getFuelConsumptionMetrics } from '../controllers/fuelController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/fileUpload.js';

const router = express.Router();

router.post('/purchase', 
  protect, 
  upload.single('receiptPhoto'), 
  createFuelPurchase
);

router.get('/stock', protect, getFuelStock);

router.get('/consumption-metrics', protect, getFuelConsumptionMetrics);

export default router;
