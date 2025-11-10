const express = require("express");
const router = express.Router();
const { getAllBuses, addBus,getBusesByRoute  } = require("../controllers/busController");

// Get all buses
router.get("/", getAllBuses);
router.get("/search", getBusesByRoute);

// Add new bus
router.post("/", addBus);

module.exports = router;
