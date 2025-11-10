// seedDemoData.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./db.js"); // your DB connection
const User = require("../models/User.js");
const Route = require("../models/Route.js");
const Bus = require("../models/Bus.js");

dotenv.config();

const seedDemoData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Route.deleteMany({});
    await Bus.deleteMany({});
    console.log("Existing data cleared");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // Create drivers (users with role "driver")
    const drivers = await User.insertMany([
      {
        name: "Tushar Kumar",
        email: "tushar110704@gmail.com",
        password: hashedPassword,
        role: "driver",
        licenseNumber: "DL1234",
        phone: "9876543210",
        experience: 0,
        verificationStatus: "approved"
      },
      {
        name: "Rahul Singh",
        email: "rahul@gmail.com",
        password: hashedPassword,
        role: "driver",
        licenseNumber: "DL5678",
        phone: "9876543211",
        experience: 2,
        verificationStatus: "approved"
      }
    ]);
    console.log("Drivers added");

    // Create routes
    const routes = await Route.insertMany([
      { name: "Delhi to Noida", stops: ["Delhi", "Shahdara", "Ghaziabad", "Noida"], distance: 35, estimatedTime: "1h 15m" },
      { name: "Noida to Ghaziabad", stops: ["Noida", "Vaishali", "Ghaziabad"], distance: 20, estimatedTime: "40m" },
      { name: "Gurgaon to Faridabad", stops: ["Gurgaon", "Badarpur", "Faridabad"], distance: 30, estimatedTime: "50m" },
      { name: "Majestic to ITPL", stops: ["Majestic", "MG Road", "KR Puram", "ITPL"], distance: 22, estimatedTime: "45m" }
    ]);
    console.log("Routes added");

    // Create buses
    await Bus.insertMany([
      {
        busNumber: "UP14AB1234",
        capacity: 50,
        currentLocation: { lat: 28.6139, lng: 77.2090 },
        speed: 60,
        passengers: 35,
        status: "on-time",
        route: routes[0]._id,
        driver: drivers[0]._id
      },
      {
        busNumber: "DL5C7890",
        capacity: 40,
        currentLocation: { lat: 28.5355, lng: 77.3910 },
        speed: 40,
        passengers: 20,
        status: "delayed",
        route: routes[1]._id,
        driver: drivers[1]._id
      },
      {
        busNumber: "HR26CD4567",
        capacity: 45,
        currentLocation: { lat: 28.4595, lng: 77.0266 },
        speed: 50,
        passengers: 28,
        status: "on-time",
        route: routes[2]._id,
        driver: drivers[0]._id
      }
    ]);
    console.log("Buses added");

    console.log("Demo data seeding complete!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDemoData();
