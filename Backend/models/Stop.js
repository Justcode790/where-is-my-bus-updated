const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
  stopOrder: { type: Number },
  estimatedArrivalTime: { type: Date } // For scheduled times
}, { timestamps: true });

module.exports = mongoose.model("Stop", stopSchema);

