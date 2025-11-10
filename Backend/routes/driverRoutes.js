const express = require("express");
const router = express.Router();
const {
  login,
  getAssignedBus,
  startTrip,
  stopTrip,
  updateLocation,
} = require("../controllers/driverController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", login);

// Protected routes (Driver only)
router.use(authMiddleware);
router.get("/assigned-bus", getAssignedBus);
router.post("/start-trip", startTrip);
router.post("/stop-trip", stopTrip);
router.post("/update-location", updateLocation);

module.exports = router;
