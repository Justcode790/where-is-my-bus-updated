const express = require("express");
const router = express.Router();
const {
  register,
  login,
  addBus,
  getBuses,
  addRoute,
  getRoutes,
  assignDriver,
  getDrivers,
  getLiveBusLocation,
} = require("../controllers/adminController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (Admin only)
router.use(authMiddleware);
router.post("/add-bus", addBus);
router.get("/buses", getBuses);
router.post("/add-route", addRoute);
router.get("/routes", getRoutes);
router.get("/drivers", getDrivers);
router.post("/assign-driver", assignDriver);
router.get("/live/:busId", getLiveBusLocation);

module.exports = router;

