// mqttController.js
const mqttService = require('../services/mqttServices');

exports.publishMessage = (req, res) => {
  const { topic, message } = req.body;

  mqttService.publish(topic, message)
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ error: error.message }));
};
