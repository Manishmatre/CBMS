import { FuelPurchase } from '../models/fuelPurchaseModel.js';
import { FuelConsumption } from '../models/fuelConsumptionModel.js';
import { Vehicle } from '../models/vehicleModel.js'; // Import Vehicle model
import asyncHandler from 'express-async-handler';

// @desc    Create fuel purchase (bulk or direct)
// @route   POST /api/fuel/purchase
// @access  Private
const createFuelPurchase = asyncHandler(async (req, res) => {
  try {
    const requiredFields = {
      fuelType: 'Fuel Type',
      quantity: 'Quantity',
      perLiterPrice: 'Price per liter',
      totalCost: 'Total Cost',
      paymentMethod: 'Payment Method',
      vendor: 'Vendor',
      purchaseType: 'Purchase Type',
      employee: 'Employee',
      fuelSource: 'Fuel Source'
    };

    // Validate required fields
    const missingFields = [];
    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) missingFields.push(name);
    }

    if (missingFields.length > 0) {
      res.status(400);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Additional validation for direct purchases
    if (req.body.purchaseType === 'direct' && !req.body.vehicleId) {
      res.status(400);
      throw new Error('Vehicle ID is required for direct purchases');
    }

    // Create purchase record
    const purchase = await FuelPurchase.create({
      user: req.user.id,
      ...req.body,
      quantity: parseFloat(req.body.quantity),
      perLiterPrice: parseFloat(req.body.perLiterPrice),
      totalCost: parseFloat(req.body.totalCost),
      receiptPhoto: req.file?.path,
      ...(req.body.purchaseType === 'direct' && { vehicle: req.body.vehicleId })
    });

    res.status(201).json({
      success: true,
      data: purchase,
      message: 'Fuel purchase recorded successfully'
    });

  } catch (error) {
    console.error('Error creating fuel purchase:', error);
    res.status(error.statusCode || 500);
    throw new Error(error.message || 'Failed to create fuel purchase');
  }
});

// @desc    Create fuel consumption
// @route   POST /api/fuel/consumption
// @access  Private
const createFuelConsumption = asyncHandler(async (req, res) => {
  try {
    const requiredFields = {
      fuelType: 'Fuel Type',
      quantity: 'Quantity', 
      vehicleId: 'Vehicle',
      odometerReading: 'Odometer Reading',
      employee: 'Employee'
    };

    // Validate required fields
    const missingFields = [];
    for (const [field, name] of Object.entries(requiredFields)) {
      if (!req.body[field]) missingFields.push(name);
    }

    if (missingFields.length > 0) {
      res.status(400);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Numeric validation
    if (isNaN(req.body.quantity) || isNaN(req.body.odometerReading)) {
      res.status(400);
      throw new Error('Quantity and odometer reading must be numbers');
    }

    // Create consumption record
    const consumption = await FuelConsumption.create({
      user: req.user.id,
      fuelType: req.body.fuelType,
      quantity: parseFloat(req.body.quantity),
      vehicle: req.body.vehicleId,
      odometerReading: parseInt(req.body.odometerReading),
      tripDetails: req.body.tripDetails,
      receiptPhoto: req.file?.path,
      employee: req.body.employee,
      notes: req.body.notes,
      fuelSource: req.body.fuelSource || 'company_stock'
    });

    res.status(201).json({
      success: true,
      data: consumption,
      message: 'Fuel consumption recorded successfully'
    });

  } catch (error) {
    console.error('Error creating fuel consumption:', error);
    res.status(error.statusCode || 500);
    throw new Error(error.message || 'Failed to create fuel consumption');
  }
});

// @desc    Get all fuel records
// @route   GET /api/fuel
// @access  Private
const getFuelRecords = asyncHandler(async (req, res) => {
  const purchases = await FuelPurchase.find({ user: req.user.id });
  const consumptions = await FuelConsumption.find({ user: req.user.id });
  
  res.status(200).json({
    purchases,
    consumptions
  });
});

// @desc    Calculate fuel consumption
// @route   POST /api/fuel/consumption/calculate
// @access  Private
const calculateFuelConsumption = asyncHandler(async (req, res) => {
  const { 
    vehicleId, 
    fuelType, 
    quantity, 
    mileage, 
    previousMileage 
  } = req.body;

  if (!vehicleId || !fuelType || !quantity || !mileage || !previousMileage) {
    res.status(400);
    throw new Error('Missing required fields');
  }

  if (mileage <= previousMileage) {
    res.status(400);
    throw new Error('Current mileage must be greater than previous mileage');
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  const distance = mileage - previousMileage;
  const efficiency = distance / quantity;

  res.status(200).json({
    distance,
    efficiency
  });
});

export { 
  createFuelPurchase,
  createFuelConsumption, 
  getFuelRecords,
  calculateFuelConsumption 
};
