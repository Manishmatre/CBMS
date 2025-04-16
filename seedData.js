import mongoose from "mongoose";
import Vehicle from "./models/vehicleModel.js";
import FuelRecord from "./models/fuelRecordModel.js";

const MONGO_URI = "mongodb://localhost:27017/vehicle-management";

const seedVehicles = [
  {
    name: "Company Van",
    type: "Van",
    number: "ABC123",
    make: "Toyota",
    model: "Hiace",
    year: 2020,
    status: "Active",
    mileage: 50000
  },
  {
    name: "Delivery Truck",
    type: "Truck",
    number: "XYZ789",
    make: "Isuzu",
    model: "NPR",
    year: 2019,
    status: "Active",
    mileage: 75000
  },
  {
    name: "Executive Car",
    type: "Sedan",
    number: "DEF456",
    make: "Honda",
    model: "Accord",
    year: 2021,
    status: "Active",
    mileage: 25000
  }
];

const seedFuelRecords = [
  {
    vehicleId: null, // Will be set after vehicle creation
    date: new Date("2024-03-15"),
    fuelType: "Gasoline",
    quantity: 45.5,
    cost: 120.75,
    mileage: 12500,
    previousMileage: 12000,
    location: "Gas Station A",
    notes: "Regular maintenance"
  },
  {
    vehicleId: null, // Will be set after vehicle creation
    date: new Date("2024-03-10"),
    fuelType: "Diesel",
    quantity: 60.0,
    cost: 180.00,
    mileage: 8500,
    previousMileage: 8000,
    location: "Gas Station B",
    notes: "Long trip"
  },
  {
    vehicleId: null, // Will be set after vehicle creation
    date: new Date("2024-03-05"),
    fuelType: "Gasoline",
    quantity: 40.0,
    cost: 110.00,
    mileage: 15000,
    previousMileage: 14500,
    location: "Gas Station C",
    notes: "City driving"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Vehicle.deleteMany({});
    await FuelRecord.deleteMany({});
    console.log("Cleared existing data");

    // Insert vehicles
    const vehicles = await Vehicle.insertMany(seedVehicles);
    console.log("Inserted vehicles");

    // Update fuel records with vehicle IDs
    const updatedFuelRecords = seedFuelRecords.map((record, index) => ({
      ...record,
      vehicleId: vehicles[index % vehicles.length]._id,
      distance: record.mileage - record.previousMileage,
      efficiency: (record.mileage - record.previousMileage) / record.quantity
    }));

    // Insert fuel records
    await FuelRecord.insertMany(updatedFuelRecords);
    console.log("Inserted fuel records");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase(); 