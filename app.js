const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const fuelRecordRoutes = require('./routes/fuelRecordRoutes');
const insuranceRecordRoutes = require('./routes/insuranceRecordRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');
const designationRoutes = require('./routes/designationRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/fuel-records', fuelRecordRoutes);
app.use('/api/insurance-records', insuranceRecordRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/designations', designationRoutes);

