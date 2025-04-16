#!/usr/bin/env node
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import leaveRequestRoutes from "./routes/leaveRequestRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

// MongoDB connection string - using a local database
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vehicle-management";

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
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
