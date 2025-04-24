import mongoose from 'mongoose';

const fuelPurchaseSchema = new mongoose.Schema({
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
  perLiterPrice: {
    type: Number,
    required: true,
    min: 1
  },
  totalCost: {
    type: Number,
    required: true,
    min: 1
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'upi', 'netbanking']
  },
  vendor: {
    type: String,
    required: true
  },
  purchaseType: {
    type: String,
    required: true,
    enum: ['bulk', 'direct']
  },
  receiptPhoto: String,
  employee: {
    type: String,
    required: true
  },
  notes: String,
  fuelSource: {
    type: String,
    required: true,
    enum: ['company_stock', 'external'],
    default: 'company_stock'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: function() { return this.purchaseType === 'direct'; }
  }
}, { timestamps: true });

// Check if model already exists before compiling
const FuelPurchase = mongoose.models.FuelPurchase || 
  mongoose.model('FuelPurchase', fuelPurchaseSchema);

export { FuelPurchase };
