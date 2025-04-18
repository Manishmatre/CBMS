import VehicleDocument from '../models/vehicleDocumentModel.js';
import Vehicle from '../models/vehicleModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import fs from 'fs/promises';
import path from 'path';

// Upload document with validation
export const uploadVehicleDocument = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { documentType, documentNumber, expiryDate } = req.body;

    // Construct accessible file URL
    const fileUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';

    const doc = new VehicleDocument({
      vehicleId,
      documentType: documentType || '',
      documentNumber: documentNumber || '',
      expiryDate: expiryDate || null,
      fileUrl,
      fileName: req.file ? req.file.originalname : '',
      fileSize: req.file ? req.file.size : 0,
      uploadedBy: req.user ? req.user._id : null
    });

    await doc.save();
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    console.error('Failed to save document:', error);
    res.status(500).json({ success: false, message: 'Save failed', error: error.message });
  }
};

export const getVehicleDocuments = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    // Fetch docs and build accessible URLs
    let documents = await VehicleDocument.find({ vehicleId }).lean();
    documents = documents.map(doc => {
      if (doc.fileUrl) {
        const filename = path.basename(doc.fileUrl);
        doc.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
      }
      return doc;
    });
    
    res.status(200).json({
      success: true,
      data: documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    });
  }
};

export const deleteVehicleDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    await VehicleDocument.findByIdAndDelete(docId);
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
};
