const express = require("express");
const deviceController = require("../controllers/deviceController");
const router = express.Router();

// Create a new device
router.post("/create", deviceController.createDevice);

// Get a device by farm ID
router.get("/:farm_id", deviceController.getDevice);

// Get a device by device ID
router.get("/info/:device_id", deviceController.getDevicebyId);

// Create water gate control data
router.post("/watergatecontrol", deviceController.createWaterGateControl);

// Get water gate control data by device ID
router.get("/watergatecontrol/info/:device_id", deviceController.getWaterGateControl);

// Get all water gate control data by farm ID
router.get("/watergatecontrol/:farm_id", deviceController.getAllWaterGateControl);

// Update water gate control data
router.put("/watergatecontrol", deviceController.updateWaterGateControl);

// Get telemetry data by device ID
router.get("/telemetry/:farm_id", deviceController.getTelemetry);

module.exports = router;
