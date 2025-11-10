const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllAdmins,
  getAdminDetails,
  deleteAdmin,
  getAllBuses,
} = require("../controllers/superAdminController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (Super Admin only)
router.use(authMiddleware);
router.get("/admins", getAllAdmins);
router.get("/admin/:id", getAdminDetails);
router.delete("/admin/:id", deleteAdmin);
router.get("/buses", getAllBuses);

module.exports = router;

