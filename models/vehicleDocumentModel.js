import mongoose from 'mongoose';

const vehicleDocumentSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  documentType: String,
  documentNumber: String,
  expiryDate: Date,
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const VehicleDocument = mongoose.model('VehicleDocument', vehicleDocumentSchema);

export default VehicleDocument;
