const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  organizationName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  role: { type: String, default: "admin" },
  isActive: { type: Boolean, default: true },
  verificationStatus: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Admin", adminSchema);

