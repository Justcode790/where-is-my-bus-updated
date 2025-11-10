// models/Announcement.js
const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Announcement", announcementSchema);
