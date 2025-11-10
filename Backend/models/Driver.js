const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  licenseNumber: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  experience: { type: Number, default: 0 },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin",
    required: true 
  },
  assignedBus: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Bus",
    default: null 
  },
  isActive: { type: Boolean, default: true },
  role: { type: String, default: "driver" }
}, { timestamps: true });

// Hash password before saving
driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Driver", driverSchema);

