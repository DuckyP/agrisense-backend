const express = require("express");
const farmController = require("../controllers/farmController");
const router = express.Router();

// Create a new farm
router.post("/create", farmController.createFarm);

// Get a farm by farmer ID
router.get("/:farmer_id", farmController.getFarm);

// Get a farm by farm ID
router.get("/info/:farm_id", farmController.getFarmbyId);

// Update total rice harvest
router.put("/update/riceharvest", farmController.updateRiceHarvest);

// Create a new address
router.post("/address", farmController.createAddress);

// Get address by farm ID
router.get("/address/:farm_id", farmController.getAddress);

// Update carbon credit
router.put("/update/carboncredit", farmController.updateCarbonCredit);

module.exports = router;