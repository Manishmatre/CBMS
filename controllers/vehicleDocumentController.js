import VehicleDocument from '../models/VehicleDocument.js';
import { uploadFileToGCS } from '../utils/gcs.js';

// Upload document to Google Cloud Storage and save metadata
export const uploadVehicleDocument = async (req, res) => {
  try {
    console.log('Incoming upload request:');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { vehicleId, documentType, expiryDate } = req.body;
    if (!req.file) {
      console.error('No file uploaded.');
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    if (!vehicleId || !documentType) {
      console.error('Missing required fields:', { vehicleId, documentType });
      return res.status(400).json({ success: false, message: 'vehicleId and documentType are required.' });
    }

    // Validate file type and size (redundant, multer should have handled, but double-check)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      console.error('Rejected file type:', req.file.mimetype);
      return res.status(400).json({ success: false, message: 'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.' });
    }
    if (req.file.size > 5 * 1024 * 1024) {
      console.error('File too large:', req.file.size);
      return res.status(400).json({ success: false, message: 'File size exceeds 5MB limit.' });
    }

    // Upload to GCS
    let publicUrl;
    try {
      const gcsFileName = `${vehicleId}/${Date.now()}-${req.file.originalname}`;
      publicUrl = await uploadFileToGCS(req.file.buffer, gcsFileName, req.file.mimetype);
      console.log('File uploaded to GCS:', publicUrl);
    } catch (gcsError) {
      console.error('GCS upload failed:', gcsError);
      return res.status(500).json({ success: false, message: 'Failed to upload to Google Cloud Storage.', error: gcsError.message });
    }

    // Save metadata to MongoDB
    let doc;
    try {
      doc = await VehicleDocument.create({
        vehicleId,
        documentType,
        fileName: req.file.originalname,
        url: publicUrl,
        expiryDate: expiryDate || null,
        uploadedBy: req.user ? req.user._id : null,
      });
      console.log('Document metadata saved to MongoDB:', doc._id);
    } catch (mongoError) {
      console.error('MongoDB save failed:', mongoError);
      return res.status(500).json({ success: false, message: 'Failed to save document metadata.', error: mongoError.message });
    }

    res.status(201).json({ success: true, data: doc, message: 'Document uploaded successfully.' });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ success: false, message: 'Upload failed.', error: error.message });
  }
};

export const getVehicleDocuments = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    let documents = await VehicleDocument.find({ vehicleId }).lean();
    
        // No signed URLs or GCS download links, just return docs
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
    const doc = await VehicleDocument.findByIdAndDelete(docId);
    // No GCS deletion needed

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
