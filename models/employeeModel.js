import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String },
  maritalStatus: { type: String },
  nationality: { type: String },
  bloodGroup: { type: String },
  religion: { type: String },
  
  // Contact Information
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  currentAddress: { type: String },
  permanentAddress: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  
  // Professional Information
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: Date },
  employmentType: { type: String },
  reportingTo: { type: String },
  workLocation: { type: String },
  workEmail: { type: String },
  workPhone: { type: String },
  
  // Educational Information
  highestQualification: { type: String },
  university: { type: String },
  yearOfGraduation: { type: String },
  specialization: { type: String },
  
  // Emergency Contact
  emergencyContactName: { type: String },
  emergencyContactRelation: { type: String },
  emergencyContactPhone: { type: String },
  emergencyContactAddress: { type: String },
  
  // Bank Information
  bankName: { type: String },
  accountNumber: { type: String },
  accountHolderName: { type: String },
  ifscCode: { type: String },
  branchName: { type: String },
  
  // Documents
  panNumber: { type: String },
  aadharNumber: { type: String },
  passportNumber: { type: String },
  passportExpiry: { type: Date },
  
  // Additional Information
  previousExperience: { type: String },
  skills: { type: String },
  languages: { type: String },
  references: { type: String },
}, {
  timestamps: true
});

const EmployeeModel = mongoose.model("Employee", employeeSchema);
export default EmployeeModel;

