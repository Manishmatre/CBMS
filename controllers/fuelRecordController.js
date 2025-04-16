import FuelRecord from '../models/fuelRecordModel.js';
import Vehicle from '../models/vehicleModel.js';
import mongoose from 'mongoose';

// Add a new fuel record
export const addFuelRecord = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['vehicleId', 'fuelType', 'quantity', 'cost', 'mileage', 'previousMileage', 'location'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Calculate distance and efficiency
    const distance = req.body.mileage - req.body.previousMileage;
    const efficiency = distance / req.body.quantity;

    // Create new fuel record
    const fuelRecord = new FuelRecord({
      ...req.body,
      distance,
      efficiency
    });

    // Save the record
    const savedRecord = await fuelRecord.save();

    // Update vehicle's mileage
    await Vehicle.findByIdAndUpdate(req.body.vehicleId, {
      mileage: req.body.mileage
    });

    res.status(201).json({
      success: true,
      message: 'Fuel record added successfully',
      data: savedRecord
    });
  } catch (error) {
    console.error('Error adding fuel record:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add fuel record'
    });
  }
};

// Get all fuel records with vehicle details
export const getAllFuelRecords = async (req, res) => {
  try {
    const fuelRecords = await FuelRecord.find()
      .populate('vehicleId', 'name number make model year')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: fuelRecords.length,
      data: fuelRecords
    });
  } catch (error) {
    console.error('Error fetching fuel records:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get fuel records for a specific vehicle
export const getVehicleFuelRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle ID'
      });
    }

    const fuelRecords = await FuelRecord.find({ vehicleId })
      .populate('vehicleId', 'name number make model year')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: fuelRecords.length,
      data: fuelRecords
    });
  } catch (error) {
    console.error('Error fetching vehicle fuel records:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get a single fuel record
export const getFuelRecord = async (req, res) => {
  try {
    const fuelRecord = await FuelRecord.findById(req.params.id)
      .populate('vehicleId', 'name number make model year');

    if (!fuelRecord) {
      return res.status(404).json({
        success: false,
        error: 'Fuel record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fuelRecord
    });
  } catch (error) {
    console.error('Error fetching fuel record:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update a fuel record
export const updateFuelRecord = async (req, res) => {
  try {
    const fuelRecord = await FuelRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('vehicleId', 'name number make model year');

    if (!fuelRecord) {
      return res.status(404).json({
        success: false,
        error: 'Fuel record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fuelRecord
    });
  } catch (error) {
    console.error('Error updating fuel record:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete a fuel record
export const deleteFuelRecord = async (req, res) => {
  try {
    const fuelRecord = await FuelRecord.findByIdAndDelete(req.params.id);

    if (!fuelRecord) {
      return res.status(404).json({
        success: false,
        error: 'Fuel record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting fuel record:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 