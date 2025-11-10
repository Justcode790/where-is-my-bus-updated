const Route = require("../models/Route");

// @desc    Get all routes
// @route   GET /pi/official/routes
// @access  Public or protected based on your auth
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    // console.log(routes);
    
    res.status(200).json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a new route
// @route   POST /pi/official/routes
// @access  Public or protected
const addRoute = async (req, res) => {
  try {
    let { name, stops, distance, estimatedTime } = req.body;

    // ✅ Remove empty stops
    if (Array.isArray(stops)) {
      stops = stops.filter(stop => stop && stop.trim() !== "");
    }

    const newRoute = new Route({
      name,
      stops, // cleaned array
      distance,
      estimatedTime
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (err) {
    console.error("Error adding route:", err);
    res.status(500).json({ message: err.message || "Server Error" });
  }
};

module.exports = { getAllRoutes, addRoute };
