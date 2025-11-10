const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["driver", "official"],
    required: true,
  },

  // Driver-specific fields
  licenseNumber: { 
    type: String, 
    unique: true, 
    sparse: true,
    required: function () { return this.role === "driver"; }
  },
  phone: { 
    type: String, 
    sparse: true,
    required: function () { return this.role === "driver"; }
  },
  experience: { 
    type: Number, 
    default: 0 
  },

  // Official-specific fields
  govtIdNumber: { type: String, sparse: true },
  documentType: { type: String, sparse: true },
  documentUrl: { type: String, sparse: true }, 

  verificationStatus: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "approved"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
