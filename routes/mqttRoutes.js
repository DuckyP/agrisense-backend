// mqttRoutes.js
const express = require('express');
const router = express.Router();
const mqttController = require('../controllers/mqttController');

// POST route to publish a message
router.post('/publish', mqttController.publishMessage);

module.exports = router;
