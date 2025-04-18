#!/usr/bin/env node
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { createUploadsDir } from './middleware/uploadMiddleware.js';
import multer from 'multer';

// Import all routes
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import vehicleDocumentRoutes from './routes/vehicleDocumentRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import leaveRequestRoutes from './routes/leaveRequestRoutes.js';
import insuranceRecordRoutes from './routes/insuranceRecordRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

// MongoDB connection string - using a local database
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vehicle-management";

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create uploads directory
createUploadsDir();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicles', vehicleDocumentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leave-requests', leaveRequestRoutes);
app.use('/api/insurance-records', insuranceRecordRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

// Emergency document upload endpoint
const upload = multer({ dest: uploadsDir });
app.post('/api/emergency-upload', upload.any(), (req, res) => {
  const files = req.files;
  if (!files || Object.keys(files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  
  // Just respond with file info - we'll process later
  res.json({
    success: true,
    files: Object.keys(files).map(key => ({
      name: files[key].name,
      size: files[key].size,
      mimetype: files[key].mimetype
    }))
  });
});

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB at:", MONGO_URI);
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("MongoDB connected successfully");
    
    // Start the server only after MongoDB connection is established
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
