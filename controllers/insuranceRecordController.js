import InsuranceRecord from '../models/insuranceRecordModel.js';
import Vehicle from '../models/vehicleModel.js';

// Add new insurance record with file support
const addInsuranceRecord = async (req, res) => {
  try {
    const insuranceData = {
      vehicleId: req.body.vehicleId,
      policyNumber: req.body.policyNumber,
      provider: req.body.provider,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      premium: req.body.premium,
      coverage: req.body.coverage,
      notes: req.body.notes,
      documents: []
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      insuranceData.documents = req.files.map(file => ({
        data: file.buffer,
        mimetype: file.mimetype,
        filename: file.originalname,
        size: file.size,
        uploadedAt: new Date()
      }));
    }

    const record = new InsuranceRecord(insuranceData);
    await record.save();

    // Update the vehicle's insurance info after creating the insurance record
    await Vehicle.findByIdAndUpdate(
      insuranceData.vehicleId,
      {
        insurancePolicyNumber: insuranceData.policyNumber,
        insuranceExpireDate: insuranceData.endDate,
        insuranceProvider: insuranceData.provider,
        insuranceId: record._id
      }
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Insurance record created successfully and vehicle updated',
      data: record 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        message: 'Policy number already exists' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error creating insurance record', 
        error: error.message 
      });
    }
  }
};

// Update insurance record (does not update files for simplicity)
const updateInsuranceRecord = async (req, res) => {
  try {
    const record = await InsuranceRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({ success: false, message: 'Insurance record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Policy number already exists' });
    } else {
      res.status(500).json({ success: false, message: 'Error updating insurance record', error: error.message });
    }
  }
};

// Get insurance records for a specific vehicle
const getVehicleInsuranceRecords = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const records = await InsuranceRecord.find({ vehicleId })
      .populate('vehicleId', 'registrationNumber make model')
      .sort({ startDate: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching insurance records', 
      error: error.message 
    });
  }
};

export { addInsuranceRecord, updateInsuranceRecord, getVehicleInsuranceRecords };
