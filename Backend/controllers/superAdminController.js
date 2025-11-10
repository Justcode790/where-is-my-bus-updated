const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Driver = require("../models/Driver");

// Register Super Admin
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Super Admin already exists" });
    }

    const superAdmin = new SuperAdmin({ name, email, password });
    await superAdmin.save();

    const token = jwt.sign(
      { id: superAdmin._id, role: "superadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Super Admin registered successfully",
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: "superadmin",
      },
      token,
    });
  } catch (err) {
    console.error("Super Admin Register Error:", err.message);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// Login Super Admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: superAdmin._id, role: "superadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      msg: "Login successful",
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: "superadmin",
      },
      token,
    });
  } catch (err) {
    console.error("Super Admin Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password")
      .populate("organizationName")
      .sort({ createdAt: -1 });

    res.json({ admins });
  } catch (err) {
    console.error("Get Admins Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get admin details with buses, routes, drivers
exports.getAdminDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id).select("-password");
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    const buses = await Bus.find({ adminId: id })
      .populate("route")
      .populate("driver");
    
    const routes = await Route.find({ adminId: id });
    
    const drivers = await Driver.find({ adminId: id })
      .select("-password");

    res.json({
      admin,
      buses,
      routes,
      drivers,
    });
  } catch (err) {
    console.error("Get Admin Details Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Optionally, you can also delete associated buses, routes, drivers
    await Admin.findByIdAndDelete(id);

    res.json({ msg: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete Admin Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all buses (for super admin overview)
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate("adminId", "name organizationName")
      .populate("route")
      .populate("driver", "name licenseNumber phone")
      .sort({ createdAt: -1 });

    res.json({ buses });
  } catch (err) {
    console.error("Get All Buses Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

