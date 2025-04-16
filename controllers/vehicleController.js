import Vehicle from '../models/VehicleModel.js';
import mongoose from 'mongoose';

// Add a new vehicle
export const addVehicle = async (req, res) => {
  try {
    console.log('Received vehicle data:', req.body);
    
    // Check MongoDB connection
    const connectionState = mongoose.connection.readyState;
    console.log('MongoDB Connection State:', connectionState);
    
    if (connectionState !== 1) {
      return res.status(500).json({
        success: false,
        error: 'Database connection error. Please try again later.'
      });
    }
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'number', 'make', 'model', 'year'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if vehicle with same number already exists
    const existingVehicle = await Vehicle.findOne({ number: req.body.number });
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        error: 'A vehicle with this license plate number already exists'
      });
    }
    
    console.log('Creating new vehicle document...');
    const vehicle = new Vehicle(req.body);
    
    console.log('Attempting to save vehicle...');
    const savedVehicle = await vehicle.save();
    console.log('Vehicle saved successfully:', savedVehicle);
    
    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: savedVehicle
    });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A vehicle with this license plate number already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add vehicle'
    });
  }
};

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get single vehicle
export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 