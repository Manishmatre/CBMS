import express from 'express';
import upload from '../middleware/upload.js';
import { uploadVehicleDocument } from '../controllers/vehicleDocumentController.js';

const router = express.Router();

// Upload route: POST /api/vehicle-documents/upload
router.post('/upload', upload.single('file'), uploadVehicleDocument);

// POST /api/vehicles/:vehicleId/documents
router.post('/vehicles/:vehicleId/documents', upload.single('file'), (req, res, next) => {
  req.body.vehicleId = req.params.vehicleId;
  uploadVehicleDocument(req, res, next);
});

export default router;
