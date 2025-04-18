import express from 'express';
import {
  uploadVehicleDocument,
  getVehicleDocuments,
  deleteVehicleDocument
} from '../controllers/vehicleDocumentController.js';
import upload from '../middleware/uploadMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Document routes
router.post('/:vehicleId/documents', 
  authMiddleware, 
  upload.single('document'), 
  uploadVehicleDocument
);

router.get('/:vehicleId/documents', 
  authMiddleware, 
  getVehicleDocuments
);

router.delete('/documents/:docId', 
  authMiddleware, 
  deleteVehicleDocument
);

export default router;
