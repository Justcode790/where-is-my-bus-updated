const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Driver = require("../models/Driver");

// Register Admin
exports.register = async (req, res) => {
  try {
    const { name, email, password, organizationName, phone, address } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin with this email already exists" });
    }

    const admin = new Admin({
      name,
      email,
      password,
      organizationName,
      phone,
      address,
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Admin registered successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        organizationName: admin.organizationName,
        role: "admin",
      },
      token,
    });
  } catch (err) {
    console.error("Admin Register Error:", err.message);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// Login Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res.status(403).json({ msg: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
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
        id: admin._id,
        name: admin.name,
        email: admin.email,
        organizationName: admin.organizationName,
        role: "admin",
      },
      token,
    });
  } catch (err) {
    console.error("Admin Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// Add Bus
exports.addBus = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { busNumber, capacity, routeId, scheduledDepartureTime } = req.body;

    const route = await Route.findOne({ _id: routeId, adminId });
    if (!route) {
      return res.status(404).json({ msg: "Route not found" });
    }

    const bus = new Bus({
      busNumber,
      capacity,
      adminId,
      route: routeId,
      scheduledDepartureTime: scheduledDepartureTime ? new Date(scheduledDepartureTime) : null,
    });

    await bus.save();

    res.status(201).json({
      msg: "Bus added successfully",
      bus: await Bus.findById(bus._id).populate("route"),
    });
  } catch (err) {
    console.error("Add Bus Error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Bus number already exists" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all buses for admin
exports.getBuses = async (req, res) => {
  try {
    const adminId = req.user.id;
    const buses = await Bus.find({ adminId })
      .populate("route")
      .populate("driver", "name licenseNumber phone")
      .sort({ createdAt: -1 });

    res.json({ buses });
  } catch (err) {
    console.error("Get Buses Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Add Route
exports.addRoute = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, stops, distanceKm, estimatedTime } = req.body;

    if (!stops || stops.length < 2) {
      return res.status(400).json({ msg: "Route must have at least 2 stops" });
    }

    // Add stopOrder to stops
    const stopsWithOrder = stops.map((stop, index) => ({
      ...stop,
      stopOrder: index + 1,
    }));

    const route = new Route({
      name,
      adminId,
      numberOfStops: stops.length,
      stops: stopsWithOrder,
      distanceKm,
      estimatedTime,
    });

    await route.save();

    res.status(201).json({
      msg: "Route added successfully",
      route,
    });
  } catch (err) {
    console.error("Add Route Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all routes for admin
exports.getRoutes = async (req, res) => {
  try {
    const adminId = req.user.id;
    const routes = await Route.find({ adminId }).sort({ createdAt: -1 });

    res.json({ routes });
  } catch (err) {
    console.error("Get Routes Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Assign Driver to Bus
exports.assignDriver = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { busId, driverId } = req.body;

    const bus = await Bus.findOne({ _id: busId, adminId });
    if (!bus) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    const driver = await Driver.findOne({ _id: driverId, adminId });
    if (!driver) {
      return res.status(404).json({ msg: "Driver not found" });
    }

    // Unassign driver from previous bus if any
    await Bus.updateOne(
      { driver: driverId, _id: { $ne: busId } },
      { $unset: { driver: "" } }
    );

    bus.driver = driverId;
    await bus.save();

    // Update driver's assignedBus
    driver.assignedBus = busId;
    await driver.save();

    res.json({
      msg: "Driver assigned successfully",
      bus: await Bus.findById(busId).populate("driver").populate("route"),
    });
  } catch (err) {
    console.error("Assign Driver Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all drivers for admin
exports.getDrivers = async (req, res) => {
  try {
    const adminId = req.user.id;
    const drivers = await Driver.find({ adminId })
      .select("-password")
      .populate("assignedBus", "busNumber")
      .sort({ createdAt: -1 });

    res.json({ drivers });
  } catch (err) {
    console.error("Get Drivers Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get live bus location (for Socket.IO integration)
exports.getLiveBusLocation = async (req, res) => {
  try {
    const { busId } = req.params;
    const adminId = req.user.id;

    const bus = await Bus.findOne({ _id: busId, adminId });
    if (!bus) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    res.json({
      busId: bus._id,
      location: bus.currentLocation,
      status: bus.status,
      tripStatus: bus.tripStatus,
      lastUpdate: bus.lastLocationUpdate,
    });
  } catch (err) {
    console.error("Get Live Bus Location Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

