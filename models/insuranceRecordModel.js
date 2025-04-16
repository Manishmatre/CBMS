import mongoose from 'mongoose';

const insuranceRecordSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  provider: {
    type: String,
    required: true,
    trim: true
  },
  policyNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  premium: {
    type: Number,
    required: true,
    min: 0
  },
  coverage: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
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
insuranceRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const InsuranceRecord = mongoose.model('InsuranceRecord', insuranceRecordSchema);

export default InsuranceRecord; 