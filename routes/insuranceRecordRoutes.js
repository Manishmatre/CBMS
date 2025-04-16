import express from 'express';
import InsuranceRecord from '../models/insuranceRecordModel.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

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

// Create a new insurance record
router.post('/', async (req, res) => {
  try {
    const record = new InsuranceRecord(req.body);
    await record.save();
    
    const populatedRecord = await InsuranceRecord.findById(record._id)
      .populate('vehicleId', 'registrationNumber make model');
    
    res.status(201).json({
      success: true,
      data: populatedRecord
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Policy number already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating insurance record',
        error: error.message
      });
    }
  }
});

// Update an insurance record
router.put('/:id', validateObjectId, async (req, res) => {
  try {
    const record = await InsuranceRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('vehicleId', 'registrationNumber make model');
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Insurance record not found'
      });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Policy number already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating insurance record',
        error: error.message
      });
    }
  }
});

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