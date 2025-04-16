import mongoose from 'mongoose';

const fuelRecordSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid']
  },
  quantity: {
    type: Number,
    required: [true, 'Fuel quantity is required']
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required']
  },
  mileage: {
    type: Number,
    required: [true, 'Current mileage is required']
  },
  previousMileage: {
    type: Number,
    required: [true, 'Previous mileage is required']
  },
  distance: {
    type: Number,
    required: [true, 'Distance traveled is required']
  },
  efficiency: {
    type: Number,
    required: [true, 'Fuel efficiency is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
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
fuelRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const FuelRecord = mongoose.model('FuelRecord', fuelRecordSchema);

export default FuelRecord; 