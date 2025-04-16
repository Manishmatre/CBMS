import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Sick Leave', 'Vacation', 'Maternity Leave', 'Paternity Leave', 'Personal Leave']
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const LeaveRequestModel = mongoose.model("LeaveRequest", leaveRequestSchema);
export default LeaveRequestModel;
