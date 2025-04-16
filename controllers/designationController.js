const Designation = require('../models/designationModel');

// Create a new designation
exports.createDesignation = async (req, res) => {
  try {
    const designation = await Designation.create(req.body);
    res.status(201).json({
      success: true,
      data: designation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all designations
exports.getDesignations = async (req, res) => {
  try {
    const designations = await Designation.find();
    res.status(200).json({
      success: true,
      data: designations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single designation
exports.getDesignation = async (req, res) => {
  try {
    const designation = await Designation.findById(req.params.id);
    if (!designation) {
      return res.status(404).json({
        success: false,
        error: 'Designation not found'
      });
    }
    res.status(200).json({
      success: true,
      data: designation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update a designation
exports.updateDesignation = async (req, res) => {
  try {
    const designation = await Designation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (!designation) {
      return res.status(404).json({
        success: false,
        error: 'Designation not found'
      });
    }
    res.status(200).json({
      success: true,
      data: designation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a designation
exports.deleteDesignation = async (req, res) => {
  try {
    const designation = await Designation.findByIdAndDelete(req.params.id);
    if (!designation) {
      return res.status(404).json({
        success: false,
        error: 'Designation not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};