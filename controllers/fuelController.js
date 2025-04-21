import { FuelPurchase } from '../models/fuelRecordModel.js';
import Vehicle from '../models/vehicleModel.js';
import fs from 'fs';
import path from 'path';

export const createFuelPurchase = async (req, res) => {
  try {
    const { purchaseType, vehicleId, employeeName, fuelType, quantity, 
      perLiterPrice, totalCost, vendor, paymentMethod, purpose, notes } = req.body;
    
    let receiptPath = '';
    if (req.file) {
      receiptPath = `/uploads/fuel-receipts/${req.file.filename}`;
    }

    const fuelPurchase = await FuelPurchase.create({
      purchaseType,
      vehicleId: purchaseType === 'direct' ? vehicleId : null,
      employeeName,
      fuelType,
      quantity: parseFloat(quantity),
      perLiterPrice: parseFloat(perLiterPrice),
      totalCost: parseFloat(totalCost),
      vendor,
      paymentMethod,
      purpose,
      notes,
      receiptPhoto: receiptPath
    });

    // Update fuel stock if bulk purchase
    if (purchaseType === 'bulk') {
      await Vehicle.updateFuelStock(fuelType, parseFloat(quantity));
    }

    res.status(201).json({
      success: true,
      message: 'Fuel purchase recorded successfully',
      data: fuelPurchase
    });
  } catch (error) {
    console.error('Error creating fuel purchase:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record fuel purchase'
    });
  }
};

export const getFuelStock = async (req, res) => {
  try {
    const stock = await Vehicle.getFuelStock();
    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error('Error getting fuel stock:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get fuel stock'
    });
  }
};

export const getFuelConsumptionMetrics = async (req, res) => {
  try {
    const records = await FuelPurchase.aggregate([
      {
        $group: {
          _id: '$fuelType',
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$quantity', '$perLiterPrice'] } }
        }
      }
    ]);
    
    const metrics = {
      petrol: 0,
      diesel: 0,
      totalValue: 0
    };
    
    records.forEach(record => {
      if (record._id === 'Petrol') {
        metrics.petrol = record.totalQuantity;
      } else if (record._id === 'Diesel') {
        metrics.diesel = record.totalQuantity;
      }
      metrics.totalValue += record.totalValue || 0;
    });
    
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error getting fuel metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get fuel metrics'
    });
  }
};

// Add to vehicleModel.js
// static async getFuelStock() {
//   const vehicles = await this.find();
//   return vehicles.reduce((acc, vehicle) => {
//     if (!acc[vehicle.fuelType]) acc[vehicle.fuelType] = 0;
//     acc[vehicle.fuelType] += vehicle.fuelStock || 0;
//     return acc;
//   }, {});
// }

// static async updateFuelStock(fuelType, quantity) {
//   await this.updateMany(
//     { fuelType },
//     { $inc: { fuelStock: quantity } }
//   );
// }
