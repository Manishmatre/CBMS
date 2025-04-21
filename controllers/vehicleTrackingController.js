import express from 'express';
import mongoose from 'mongoose';
import Vehicle from '../models/vehicleModel.js';
import VehicleTracking from '../models/vehicleTrackingModel.js';
import validateObjectId from '../middleware/validateObjectId.js';

// Record vehicle location
const recordVehicleLocation = async (req, res) => {
  try {
    const { vehicleId, latitude, longitude } = req.body;
    
    // Validate vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Create tracking record
    const trackingRecord = await VehicleTracking.create({
      vehicle: vehicleId,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      timestamp: new Date()
    });
    
    res.status(201).json({
      success: true,
      data: trackingRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get vehicle's current location
const getCurrentLocation = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    const location = await VehicleTracking.findOne({ vehicle: vehicleId })
      .sort({ timestamp: -1 })
      .limit(1);
    
    if (!location) {
      return res.status(404).json({ error: 'No location data found' });
    }
    
    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get vehicle's location history
const getLocationHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = { vehicle: vehicleId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const history = await VehicleTracking.find(query)
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export {
  recordVehicleLocation,
  getCurrentLocation,
  getLocationHistory
};