import express from 'express';
import multer from 'multer';
import { addInsuranceRecord, updateInsuranceRecord } from '../controllers/insuranceRecordController.js';
import InsuranceRecord from '../models/insuranceRecordModel.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all insurance records
router.get('/', async (req, res) => {
  try {
    const records = await InsuranceRecord.find()
      .populate('vehicleId', 'registrationNumber make model')
      .sort({ startDate: -1 });
    
    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching insurance records',
      error: error.message
    });
  }
});

// Get insurance records for a specific vehicle
router.get('/vehicle/:vehicleId', validateObjectId, async (req, res) => {
  try {
    const records = await InsuranceRecord.find({ vehicleId: req.params.vehicleId })
      .populate('vehicleId', 'registrationNumber make model')
      .sort({ startDate: -1 });
    
    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching insurance records',
      error: error.message
    });
  }
});

// Create a new insurance record (with file upload)
router.post('/', upload.array('documents', 5), addInsuranceRecord);

// Update an insurance record
router.put('/:id', validateObjectId, updateInsuranceRecord);

// Delete an insurance record
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const record = await InsuranceRecord.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Insurance record not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Insurance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting insurance record',
      error: error.message
    });
  }
});

export default router; 