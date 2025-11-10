const Bus = require("../models/Bus");
const Route = require('../models/Route');

// @desc    Get all buses
// @route   GET /pi/official/buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate("route")   // ✅ Route exists
      .populate("driver"); // ✅ Driver exists
    res.status(200).json(buses);
  } catch (err) {
    console.error("Error fetching buses:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


const getBusesByRoute = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to are required' });
    }

    // 1️⃣ Find all routes that contain both 'from' and 'to' in correct order
    const routes = await Route.find({
      'stops.stopName': { $all: [from, to] }
    });

    // Filter routes where 'from' comes before 'to'
    const validRoutes = routes.filter(route => {
      const fromIndex = route.stops.findIndex(s => s.stopName === from);
      const toIndex = route.stops.findIndex(s => s.stopName === to);
      return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });

    // 2️⃣ Get buses assigned to these routes
    const buses = await Bus.find({
      route: { $in: validRoutes.map(r => r._id) }
    }).populate('route'); // optional: populate route info

    // 3️⃣ Return formatted buses
    const response = buses.map(bus => ({
      id: bus._id,
      busNumber: bus.busNumber,
      name: bus.route.name,
      status: bus.status,
      etaMinutes: Math.round(bus.route.distanceKm / bus.speed * 60), // simple ETA
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



// @desc    Add a new bus
// @route   POST /pi/official/buses
const addBus = async (req, res) => {
  try {
    const { busNumber } = req.body;

    if (!busNumber) {
      return res.status(400).json({ message: "Bus number is required" }); // use return
    }

    const bus = new Bus(req.body);
    await bus.save();

    return res.status(201).json(bus); // only one response
  } catch (err) {
    console.error("Error adding bus:", err);
    return res.status(500).json({ message: "Server error" }); // only one response
  }
};


module.exports = { getAllBuses, addBus,getBusesByRoute  };
