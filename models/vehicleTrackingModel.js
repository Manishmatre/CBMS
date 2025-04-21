import mongoose from 'mongoose';

const vehicleTrackingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for efficient location queries
vehicleTrackingSchema.index({ location: '2dsphere' });

const VehicleTracking = mongoose.model('VehicleTracking', vehicleTrackingSchema);

export default VehicleTracking;
