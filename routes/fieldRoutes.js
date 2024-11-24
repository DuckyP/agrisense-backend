const express = require("express");
const fieldController = require("../controllers/fieldController");
const router = express.Router();

// Create a new field
router.post("/create", fieldController.createField);

// Get a field by farm ID
router.get("/:farm_id", fieldController.getField);

// Get a field by field ID
router.get("/info/:field_id", fieldController.getFieldbyId);

// Create rice field data
router.post("/ricefielddata", fieldController.createRiceFieldData);

// Get rice field data by field ID
router.get("/ricefielddata/:field_id", fieldController.getRiceFieldData);

// Update rice field data
router.put("/ricefielddata", fieldController.updateRiceFieldData);

// Create fertilization data
router.post("/fertilizationdata", fieldController.createFertilizationData);

// Get fertilization data by field ID
router.get("/fertilizationdata/:field_id", fieldController.getFertilizationData);

// Create emission data
router.post("/emissiondata", fieldController.createEmissionData);

// Get emission data by field ID
router.get("/emissiondata/:field_id", fieldController.getEmissionData);

// Update emission data
router.put("/emissiondata", fieldController.updateEmissionData);

module.exports = router;