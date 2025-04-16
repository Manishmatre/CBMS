const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Designation title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
designationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Designation', designationSchema);