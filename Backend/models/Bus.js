const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  busNumber: { type: String, unique: true, required: true },
  capacity: { type: Number, required: true },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  currentLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  speed: { type: Number, default: 0 },
  passengers: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ["active", "offline", "ongoing", "maintenance"], 
    default: "offline" 
  },
  route: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Route",
    required: true
  },
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Driver", 
    default: null
  },
  tripStatus: {
    type: String,
    enum: ["not-started", "in-progress", "completed", "cancelled"],
    default: "not-started"
  },
  scheduledDepartureTime: { type: Date },
  actualDepartureTime: { type: Date },
  lastLocationUpdate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);
