import LeaveRequestModel from '../models/leaveRequestModel.js';
import EmployeeModel from '../models/employeeModel.js';

// Create new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const newLeaveRequest = new LeaveRequestModel(req.body);
    const savedLeaveRequest = await newLeaveRequest.save();
    res.status(201).json({ success: true, data: savedLeaveRequest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all leave requests with employee details
export const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequestModel.find()
      .populate('employee', 'firstName lastName employeeId')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leaveRequests });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

// Update leave request status
export const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedLeaveRequest = await LeaveRequestModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedLeaveRequest) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }
    res.status(200).json({ success: true, data: updatedLeaveRequest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get HR dashboard stats
export const getHRStats = async (req, res) => {
  try {
    const totalEmployees = await EmployeeModel.countDocuments();
    const newHires = await EmployeeModel.countDocuments({
      joiningDate: { 
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) 
      }
    });
    const departments = await EmployeeModel.distinct('department');
    const pendingLeaveRequests = await LeaveRequestModel.countDocuments({ status: 'Pending' });

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        newHires,
        departments: departments.length,
        pendingLeaveRequests
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
