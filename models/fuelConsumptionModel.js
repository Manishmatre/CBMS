import mongoose from 'mongoose';

const fuelConsumptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'CNG']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle'
  },
  odometerReading: {
    type: Number,
    required: true,
    min: 1
  },
  tripDetails: String,
  receiptPhoto: String,
  employee: { type: String, required: true },
  notes: { type: String },
  fuelSource: {
    type: String,
    default: 'company_stock',
    enum: ['company_stock'] 
  },
}, {
  timestamps: true
});

// Check if model already exists before compiling
const FuelConsumption = mongoose.models.FuelConsumption || 
  mongoose.model('FuelConsumption', fuelConsumptionSchema);

export { FuelConsumption };
