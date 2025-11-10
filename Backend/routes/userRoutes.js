const express = require("express");
const router = express.Router();
const { register, login, getMe, logout } = require("../controllers/authController");
const { authMiddleware, optionalAuthMiddleware } = require("../middleware/authMiddleware");
const {
  searchRoutes,
  getBusesByRoute,
  calculateETA,
  getAllStops,
} = require("../controllers/userController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// User routes (public - no auth needed for searching)
router.get("/routes", searchRoutes);
router.get("/bus/:routeId", getBusesByRoute);
router.get("/eta", calculateETA);
router.get("/stops", getAllStops);

// Protected routes
router.get("/me", optionalAuthMiddleware, getMe);
router.post("/logout", logout);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ msg: "Your profile data", user: req.user });
});

module.exports = router;
