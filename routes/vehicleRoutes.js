import express from 'express';
import { 
  addVehicle, 
  getAllVehicles, 
  getVehicle, 
  updateVehicle, 
  deleteVehicle 
} from '../controllers/vehicleController.js';

const router = express.Router();

// Route to add a new vehicle
router.post('/', addVehicle);

// Route to get all vehicles
router.get('/', getAllVehicles);

// Route to get a single vehicle by ID
router.get('/:id', getVehicle);

// Route to update a vehicle
router.put('/:id', updateVehicle);

// Route to delete a vehicle
router.delete('/:id', deleteVehicle);

export default router; 