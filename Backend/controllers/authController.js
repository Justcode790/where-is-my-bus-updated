const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");
const Driver = require("../models/Driver");

// ✅ REGISTER (Driver + Official)
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      licenseNumber,
      phone,
      experience,
      govtIdNumber,
      documentType,
      documentUrl,
    } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // 2. Role-specific validation
    if (role === "driver") {
      if (!licenseNumber || !phone) {
        return res
          .status(400)
          .json({ msg: "Driver must provide licenseNumber and phone" });
      }
    }

    // For officials we’ll allow govtIdNumber & docs, but not mandatory (future validation can be added)

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      licenseNumber: role === "driver" ? licenseNumber : undefined,
      phone: role === "driver" ? phone : undefined,
      experience: role === "driver" ? experience || 0 : 0,
      govtIdNumber: role === "official" ? govtIdNumber : undefined,
      documentType: role === "official" ? documentType : undefined,
      documentUrl: role === "official" ? documentUrl : undefined,
    });

    await newUser.save();

    // 5. Generate JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Respond
    res.status(201).json({
      msg: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ msg: "Server error during registration" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ msg: "User not found or role mismatch" });

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Save token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 5. Respond with user info
    res.json({
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};



exports.getMe = async (req, res) => {
  try {
    // If no user (optional auth), return null
    if (!req.user || !req.user.id) {
      return res.json({ user: null, message: "Not authenticated" });
    }

    const { id, role } = req.user;
    let user;

    // Fetch user from appropriate model based on role
    if (role === "superadmin") {
      user = await SuperAdmin.findById(id).select("-password");
    } else if (role === "admin") {
      user = await Admin.findById(id).select("-password");
    } else if (role === "driver") {
      user = await Driver.findById(id).select("-password");
    } else {
      // Default to User model (official, etc.)
      user = await User.findById(id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("GetMe Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
};
