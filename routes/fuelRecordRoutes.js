import express from 'express';
import { 
  addFuelRecord,
  getAllFuelRecords,
  getVehicleFuelRecords,
  getFuelRecord,
  updateFuelRecord,
  deleteFuelRecord
} from '../controllers/fuelRecordController.js';

const router = express.Router();

// Route to add a new fuel record
router.post('/', addFuelRecord);

// Route to get all fuel records
router.get('/', getAllFuelRecords);

// Route to get fuel records for a specific vehicle
router.get('/vehicle/:vehicleId', getVehicleFuelRecords);

// Route to get a single fuel record
router.get('/:id', getFuelRecord);

// Route to update a fuel record
router.put('/:id', updateFuelRecord);

// Route to delete a fuel record
router.delete('/:id', deleteFuelRecord);

export default router; 