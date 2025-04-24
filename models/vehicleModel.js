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
  fuelStock: Number,
  notes: String,
  // File uploads as buffers
  vehiclePhoto: {
    data: Buffer,
    mimetype: String,
    filename: String
  },
  rcImage: {
    data: Buffer,
    mimetype: String,
    filename: String
  },
  insuranceDoc: {
    data: Buffer,
    mimetype: String,
    filename: String
  },
  fitnessCert: {
    data: Buffer,
    mimetype: String,
    filename: String
  },
  pucCert: {
    data: Buffer,
    mimetype: String,
    filename: String
  },
  otherDocs: [
    {
      data: Buffer,
      mimetype: String,
      filename: String
    }
  ],
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

// Add these static methods to the vehicleSchema
vehicleSchema.statics.getFuelStock = async function() {
  const vehicles = await this.find();
  return vehicles.reduce((acc, vehicle) => {
    if (!acc[vehicle.fuelType]) acc[vehicle.fuelType] = 0;
    acc[vehicle.fuelType] += vehicle.fuelStock || 0;
    return acc;
  }, {});
};

vehicleSchema.statics.updateFuelStock = async function(fuelType, quantity) {
  await this.updateMany(
    { fuelType },
    { $inc: { fuelStock: quantity } }
  );
};

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

export { Vehicle };
