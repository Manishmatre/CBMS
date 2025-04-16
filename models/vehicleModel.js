import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle name is required']
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required']
  },
  number: {
    type: String,
    required: [true, 'Vehicle number/license plate is required'],
    unique: true
  },
  make: {
    type: String,
    required: [true, 'Vehicle make is required']
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required']
  },
  year: {
    type: Number,
    required: [true, 'Vehicle year is required']
  },
  color: String,
  vin: String,
  purchaseDate: Date,
  purchasePrice: Number,
  status: {
    type: String,
    enum: ['Active', 'Under Maintenance', 'Inactive', 'Retired'],
    default: 'Active'
  },
  insuranceProvider: String,
  insurancePolicyNumber: String,
  insuranceExpireDate: Date,
  renewDate: Date,
  lastMaintenance: Date,
  nextMaintenance: Date,
  mileage: Number,
  fuelType: String,
  fuelEfficiency: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
vehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
