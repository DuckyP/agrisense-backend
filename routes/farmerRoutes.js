const express = require("express");
const farmerController = require("../controllers/farmerController");
const router = express.Router();

// Create a new farmer
router.post("/info", farmerController.createFarmer);

// Get a farmer by ID
router.get("/:farmer_id", farmerController.getFarmerById);

// Login
router.post("/login", farmerController.login);

// Create a new address
router.post("/address", farmerController.createAddress);

// Get address by farmer ID
router.get("/address/:farmer_id", farmerController.getAddress);

module.exports = router;
