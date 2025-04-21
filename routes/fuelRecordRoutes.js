import express from 'express';
import { 
  addBulkFuelRecord,
  addDirectFuelRecord,
  getAllFuelRecords,
  getVehicleFuelRecords,
  getFuelRecord,
  updateFuelRecord,
  deleteFuelRecord,
  addFuelPurchaseRecord,
  addFuelConsumptionRecord,
  getVehicleFuelConsumptionRecords,
  getFuelConsumptionMetrics,
  getVehicleFuelPurchaseRecords
} from '../controllers/fuelRecordController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Fuel Consumption Routes
router.post('/consumption', protect, addFuelConsumptionRecord);
router.get('/consumption/vehicle/:vehicleId', protect, getVehicleFuelConsumptionRecords);
router.get('/consumption/metrics', protect, getFuelConsumptionMetrics);

// Fuel Purchase Routes
router.post('/purchase', protect, upload.single('receiptPhoto'), addFuelPurchaseRecord);
router.get('/purchase/vehicle/:vehicleId', protect, getVehicleFuelPurchaseRecords);

// General Fuel Record Routes

// Route to add a bulk fuel record
router.post('/', addBulkFuelRecord);

// Route to get all fuel records
router.get('/', getAllFuelRecords);
router.get('/records', getAllFuelRecords);

// Route to get fuel records for a specific vehicle
router.get('/vehicle/:vehicleId', getVehicleFuelRecords);

// Route to get a single fuel record
router.get('/:id', getFuelRecord);

// Route to update a fuel record
router.put('/:id', updateFuelRecord);

// Route to delete a fuel record
router.delete('/:id', deleteFuelRecord);

// Route to add a bulk fuel record
router.post('/bulk', addBulkFuelRecord);

// Route to add a direct fuel record
router.post('/direct', addDirectFuelRecord);

export default router;