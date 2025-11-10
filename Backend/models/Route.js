// // models/Route.js
// const mongoose = require("mongoose");

// const routeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   stops: [{ type: String, required: true }],
//   distance: { type: Number, required: true }, // in km
//   estimatedTime: { type: String } // e.g. "45 mins"
// });

// module.exports=mongoose.model("Route", routeSchema);


// models/Route.js
const mongoose = require("mongoose");

// Stop sub-schema
const stopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  stopOrder: {
    type: Number,
    required: true,
  },
});

// Route schema
const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    numberOfStops: {
      type: Number,
      required: true,
    },
    stops: [stopSchema], // embedded stops
    distanceKm: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: String, // e.g. "45 mins"
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);
