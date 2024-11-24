// mqttService.js
const AWS = require('aws-iot-device-sdk');
const fs = require('fs');
const awsConfig = require('../config/awsConfig');

const device = AWS.device({
  clientId: awsConfig.clientId,
  host: awsConfig.endpoint,
  port: 8883,
  keyPath: awsConfig.keyPath,
  certPath: awsConfig.certPath,
  caPath: awsConfig.caPath,
});

device.on('connect', function() {
  console.log('Connected to AWS IoT');
});

device.on('error', function(error) {
  console.error('Error:', error);
});

// Service method to publish message
exports.publish = (topic, message) => {
  console.log('Publishing message to topic:', topic);
  console.log('Message:', message);
  const jsonData = {
    flow_rate: message.flow_rate,
    direction: message.direction,
    pump_status: message.pump_status,
    auto_mode: message.auto_mode
  };
  return new Promise((resolve, reject) => {
    device.publish(topic, JSON.stringify(jsonData), (err) => {
      if (err) reject(err);
      resolve({ status: 'success', message: 'Message published to ' + topic });
    });
  });
};
