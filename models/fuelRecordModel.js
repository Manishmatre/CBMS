import mongoose from 'mongoose';

const fuelPurchaseSchema = new mongoose.Schema({
  purchaseType: {
    type: String,
    required: true,
    enum: ['bulk', 'direct']
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: function() { return this.purchaseType === 'direct'; }
  },
  employeeName: String,
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  perLiterPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  vendor: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'netbanking', 'upi', 'other'],
    default: 'cash'
  },
  purpose: String,
  notes: String,
  receiptPhoto: String,
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const FuelPurchase = mongoose.model('FuelPurchase', fuelPurchaseSchema);


const fuelConsumptionSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  mileage: {
    type: Number,
    required: true,
    min: 0
  },
  previousMileage: {
    type: Number,
    required: true,
    min: 0
  },
  distance: {
    type: Number,
    required: true,
    min: 0
  },
  efficiency: {
    type: Number,
    required: true
  },
  location: String,
  driverName: String,
  notes: String,
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const FuelConsumption = mongoose.model('FuelConsumption', fuelConsumptionSchema);