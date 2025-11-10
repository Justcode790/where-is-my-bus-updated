const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Driver = require("../models/Driver");
const Bus = require("../models/Bus");
const Route = require("../models/Route");

// Login Driver
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!driver.isActive) {
      return res.status(403).json({ msg: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: driver._id, role: "driver" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login successful",
      user: {
        id: driver._id,
        name: driver.name,
        email: driver.email,
        licenseNumber: driver.licenseNumber,
        role: "driver",
      },
      token,
    });
  } catch (err) {
    console.error("Driver Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// Get assigned bus
exports.getAssignedBus = async (req, res) => {
  try {
    const driverId = req.user.id;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    if (!driver.assignedBus) {
      return res.status(404).json({ msg: "No bus assigned" });
    }

    const bus = await Bus.findById(driver.assignedBus)
      .populate("route")
      .populate("adminId", "name organizationName");

    res.json({ bus });
  } catch (err) {
    console.error("Get Assigned Bus Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Start trip
exports.startTrip = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { lat, lng } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver || !driver.assignedBus) {
      return res.status(404).json({ msg: "No bus assigned" });
    }

    const bus = await Bus.findById(driver.assignedBus);
    if (!bus) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    // Update bus status
    bus.status = "ongoing";
    bus.tripStatus = "in-progress";
    bus.actualDepartureTime = new Date();
    bus.currentLocation = { lat, lng };
    bus.lastLocationUpdate = new Date();
    await bus.save();

    // Emit Socket.IO event (handled in socket.js)
    // The socket handler will broadcast this

    res.json({
      msg: "Trip started successfully",
      bus: {
        id: bus._id,
        busNumber: bus.busNumber,
        status: bus.status,
        tripStatus: bus.tripStatus,
        location: bus.currentLocation,
      },
    });
  } catch (err) {
    console.error("Start Trip Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Stop trip
exports.stopTrip = async (req, res) => {
  try {
    const driverId = req.user.id;

    const driver = await Driver.findById(driverId);
    if (!driver || !driver.assignedBus) {
      return res.status(404).json({ msg: "No bus assigned" });
    }

    const bus = await Bus.findById(driver.assignedBus);
    if (!bus) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    bus.status = "offline";
    bus.tripStatus = "completed";
    await bus.save();

    res.json({
      msg: "Trip stopped successfully",
      bus: {
        id: bus._id,
        busNumber: bus.busNumber,
        status: bus.status,
        tripStatus: bus.tripStatus,
      },
    });
  } catch (err) {
    console.error("Stop Trip Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update location (called via Socket.IO, but also available as REST endpoint)
exports.updateLocation = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { lat, lng, speed } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver || !driver.assignedBus) {
      return res.status(404).json({ msg: "No bus assigned" });
    }

    const bus = await Bus.findById(driver.assignedBus);
    if (!bus) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    bus.currentLocation = { lat, lng };
    if (speed !== undefined) bus.speed = speed;
    bus.lastLocationUpdate = new Date();
    await bus.save();

    res.json({
      msg: "Location updated",
      location: bus.currentLocation,
    });
  } catch (err) {
    console.error("Update Location Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

