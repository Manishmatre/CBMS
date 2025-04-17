import InsuranceRecord from '../models/insuranceRecordModel.js';

// Add new insurance record with file support
export const addInsuranceRecord = async (req, res) => {
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
    
    res.status(201).json({ 
      success: true, 
      message: 'Insurance record created successfully',
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
export const updateInsuranceRecord = async (req, res) => {
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
