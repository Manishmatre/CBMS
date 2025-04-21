import mongoose from 'mongoose';

const vehicleDocumentSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ['insurance', 'rc', 'puc', 'other'], // add more as needed
  },
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  expiryDate: { type: Date },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
});

export default mongoose.model('VehicleDocument', vehicleDocumentSchema);
