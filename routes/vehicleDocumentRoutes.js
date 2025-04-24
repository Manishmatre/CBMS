import express from 'express';
import upload from '../middleware/upload.js';
import { uploadVehicleDocument, getVehicleDocuments, deleteVehicleDocument } from '../controllers/vehicleDocumentController.js';

const router = express.Router();

// Upload route: POST /api/vehicle-documents/upload
router.post('/upload', upload.single('file'), uploadVehicleDocument);

// POST /api/vehicles/:vehicleId/documents
router.post('/:vehicleId/documents', upload.single('file'), (req, res, next) => {
  req.body.vehicleId = req.params.vehicleId;
  uploadVehicleDocument(req, res, next);
});

// GET /api/vehicles/:vehicleId/documents
// Fetch all documents for a vehicle
router.get('/:vehicleId/documents', getVehicleDocuments);

// DELETE /api/vehicles/:vehicleId/documents/:docId
router.delete('/:vehicleId/documents/:docId', deleteVehicleDocument);

export default router;
