import EmployeeModel from '../models/employeeModel.js';
import mongoose from 'mongoose';

// Get department-wise employee stats with date filtering
export const getDepartmentStats = async (req, res) => {
  try {
    const { range } = req.query; // 'week', 'month', 'year'
    let startDate;
    const now = new Date();
    if (range === 'week') {
      // Start from last Monday
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0,0,0,0);
    } else if (range === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }
    let match = {};
    if (startDate) {
      match.createdAt = { $gte: startDate };
    }
    const stats = await EmployeeModel.aggregate([
      { $match: match },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new employee
export const createEmployee = async (req, res) => {
  try {
    console.log('Received employee data:', req.body);
    
    // Create new employee instance
    const newEmployee = new EmployeeModel(req.body);
    
    // Validate the employee data
    const validationError = newEmployee.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationError.errors
      });
    }
    
    // Save to database
    console.log('Attempting to save employee...');
    const savedEmployee = await newEmployee.save();
    console.log('Employee saved successfully:', savedEmployee);
    
    res.status(201).json({ success: true, data: savedEmployee });
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      details: error.errors || {}
    });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

// Get single employee by ID
export const getEmployee = async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};