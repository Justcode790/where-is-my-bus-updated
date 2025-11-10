const express = require("express");
const router = express.Router();
const { getAllRoutes, addRoute } = require("../controllers/routeController");

// Get all routes
router.get("/", getAllRoutes);

// Add new route
router.post("/", addRoute);

module.exports = router;
