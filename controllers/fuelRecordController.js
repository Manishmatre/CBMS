import { FuelPurchase, FuelConsumption } from '../models/fuelRecordModel.js';
import Vehicle from '../models/vehicleModel.js';
import mongoose from 'mongoose';

// Add a bulk fuel record
export const addBulkFuelRecord = async (req, res) => {
  try {
    const { fuelType, quantity, perLiterPrice, totalCost, vendor, paymentMethod, notes, receiptPhoto } = req.body;

    // Validate required fields
    if (!fuelType || !quantity || !perLiterPrice || !totalCost) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for bulk fuel purchase'
      });
    }

    const bulkPurchase = new FuelPurchase({
      purchaseType: 'bulk',
      fuelType,
      quantity,
      perLiterPrice,
      totalCost,
      vendor,
      paymentMethod,
      notes,
      receiptPhoto
    });

    const savedRecord = await bulkPurchase.save();

    res.status(201).json({
      success: true,
      message: 'Bulk fuel purchase recorded successfully',
      data: savedRecord,
      redirect: '/vehicles/fuel-consumption'
    });
  } catch (error) {
    console.error('Error adding bulk fuel record:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add bulk fuel record'
    });
  }
};

// Add a direct fuel record for a vehicle
export const addDirectFuelRecord = async (req, res) => {
  try {
    const { vehicleId, fuelType, quantity, perLiterPrice, totalCost, employeeName, vendor, paymentMethod, purpose, notes, receiptPhoto } = req.body;

    // Validate required fields
    if (!vehicleId || !fuelType || !quantity || !perLiterPrice || !totalCost) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for direct fuel purchase'
      });
    }

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    const directPurchase = new FuelPurchase({
      purchaseType: 'direct',
      vehicleId,
      fuelType,
      quantity,
      perLiterPrice,
      totalCost,
      employeeName,
      vendor,
      paymentMethod,
      purpose,
      notes,
      receiptPhoto
    });

    const savedRecord = await directPurchase.save();

    res.status(201).json({
      success: true,
      message: 'Direct fuel purchase recorded successfully',
      data: savedRecord,
      redirect: '/vehicles/fuel-consumption'
    });
  } catch (error) {
    console.error('Error adding direct fuel record:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add direct fuel record'
    });
  }
};


// Add a new fuel record
export const addFuelConsumptionRecord = async (req, res) => {
  try {
    const { vehicleId, fuelType, quantity , location, driverName, notes } = req.body;

    // Validate required fields
    if (!vehicleId || !fuelType || !quantity || !mileage || !previousMileage) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: vehicleId, fuelType, quantity, mileage, and previousMileage are required'
      });
    }

    // Validate mileage values
    if (mileage <= previousMileage) {
      return res.status(400).json({
        success: false,
        error: 'Current mileage must be greater than previous mileage'
      });
    }

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    const distance = mileage - previousMileage;
    const efficiency = distance / quantity;

    const fuelConsumption = new FuelConsumption({
      vehicleId,
      fuelType,
      quantity,
      mileage,
      previousMileage,
      distance,
      efficiency,
      location: location || '',
      driverName: driverName || '',
      notes: notes || ''
    });

    const savedRecord = await fuelConsumption.save();

    // Update vehicle's current mileage
    await Vehicle.findByIdAndUpdate(vehicleId, { mileage });

    res.status(201).json({
      success: true,
      message: 'Fuel consumption recorded successfully',
      data: savedRecord,
      redirect: '/vehicles/fuel-consumption'
    });
  } catch (error) {
    console.error('Error adding fuel consumption record:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add fuel consumption record'
    });
  }
};







export const addFuelPurchaseRecord = async (req, res) => {
  try {
    const { vehicleId, fuelType, quantity, perLiterPrice, totalCost, driverName, fuelStation, paymentMethod, receiptNumber } = req.body;

    // Validate required fields
    if (!vehicleId || !fuelType || !quantity || !perLiterPrice || !totalCost || !driverName || !fuelStation || !paymentMethod || !receiptNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for fuel purchase'
      });
    }

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    const fuelPurchase = new FuelPurchase({
      vehicleId,
      fuelType,
      quantity,
      perLiterPrice,
      totalCost,
      driverName,
      fuelStation,
      paymentMethod,
      receiptNumber,
      purchaseType: 'direct'
    });

    const savedRecord = await fuelPurchase.save();

    res.status(201).json({
      success: true,
      message: 'Fuel purchase recorded successfully',
      data: savedRecord
    });
  } catch (error) {
    console.error('Error adding fuel purchase record:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add fuel purchase record'
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

// Get fuel consumption records for a specific vehicle
export const getVehicleFuelConsumptionRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle ID'
      });
    }

    const records = await FuelConsumption.find({ vehicleId })
      .populate('vehicleId', 'registrationNumber make model')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error fetching fuel consumption records:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get fuel consumption metrics (efficiency, total consumption)
export const getFuelConsumptionMetrics = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    
    let query = {};
    if (vehicleId) {
      if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid vehicle ID'
        });
      }
      query.vehicleId = vehicleId;
    }

    const records = await FuelConsumption.find(query)
      .sort({ date: -1 })
      .limit(100);

    // Calculate metrics
    const metrics = {
      totalConsumption: records.reduce((sum, record) => sum + record.quantity, 0),
      averageEfficiency: records.length > 0 
        ? records.reduce((sum, record) => sum + record.efficiency, 0) / records.length 
        : 0,
      records: records
    };

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error calculating fuel metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get fuel purchase records for a specific vehicle
export const getVehicleFuelPurchaseRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle ID'
      });
    }

    const records = await FuelPurchase.find({ vehicleId })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error fetching fuel purchase records:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};