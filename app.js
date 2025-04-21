const authRoutes = require('./routes/authRoutes');
import vehicleDocumentRoutes from './routes/vehicleDocumentRoutes.js';
import upload from './middleware/upload.js';
import { uploadVehicleDocument } from './controllers/vehicleDocumentController.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicle-documents', vehicleDocumentRoutes);
app.post('/api/vehicles/:vehicleId/documents', upload.single('file'), (req, res, next) => {
  req.body.vehicleId = req.params.vehicleId;
  uploadVehicleDocument(req, res, next);
});
app.use('/api/employees', employeeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/fuel-records', fuelRecordRoutes);
app.use('/api/insurance-records', insuranceRecordRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/designations', designationRoutes);

