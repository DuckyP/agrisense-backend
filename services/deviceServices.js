const db = require('../config/dbConfig').db; // RDS database
const dynamoDb = require('../config/dbConfig').dynamoDb; // DynamoDB database
const { QueryCommand, BatchGetCommand  } = require('@aws-sdk/lib-dynamodb');
const mqttController = require('../controllers/mqttController');
const mqttService = require('../services/mqttServices');

const createDevice = async ({farm_id, device_id, name, type, latitude, longitude}) => {
  await db.query(
    "INSERT INTO Device (farm_id, device_id, name, type, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)",
    [farm_id, device_id, name, type, latitude, longitude]
  );
};

const getDevice = async (farm_id) => {
  const [device] = await db.query("SELECT * FROM Device WHERE farm_id = ?", [farm_id]);
  return device;
}

const getDevicebyId = async (device_id) => {
  const [device] = await db.query("SELECT * FROM Device WHERE id = ?", [device_id]);
  return device;
}

const createWaterGateControl = async ({device_id, field_id, name, flow_direction, status, flow_rate, open_time, close_time, auto_mode}) => {
  await db.query(
    "INSERT INTO WaterGateControl (device_id, field_id, name, flow_direction, status, flow_rate, open_time, close_time, auto_mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [device_id, field_id, name, flow_direction, status, flow_rate, open_time, close_time, auto_mode]
  );
};

const getWaterGateControl = async (device_id) => {
  const [water_gate] = await db.query("SELECT * FROM WaterGateControl WHERE id = ?", [device_id]);
  return water_gate;
}

const getAllWaterGateControl = async (farm_id) => {
  const [water_gate] = await db.query("SELECT * FROM WaterGateControl WHERE field_id IN (SELECT id FROM Field WHERE farm_id = ?)", [farm_id]);
  return water_gate;
}

const updateWaterGateControl = async (data) => {
  const [water_gate] = await db.query("SELECT * FROM WaterGateControl WHERE device_id = ?", [data["device_id"]]);
  for (const key of ["flow_rate", "status", "auto_mode", "open_time", "close_time"]) {
    if (water_gate[0][key] != null && data[key] == null) {
      data[key] = water_gate[0][key];
    }
  }
  const {device_id, flow_rate, status, auto_mode, open_time, close_time} = data;
  await db.query(
    "UPDATE WaterGateControl SET flow_rate = ?, status = ?, auto_mode = ?, open_time = ?, close_time = ? WHERE device_id = ?",
    [flow_rate, status, auto_mode, open_time, close_time, device_id]
  );
  const [device] = await db.query("SELECT device_id FROM Device WHERE id = ?", [device_id]);
  const topic = `devices/${device[0].device_id}/water_flow`;
  const message = { "direction": water_gate[0]["flow_direction"], "pump_status": status };
  mqttService.publish(topic, message);
};

const getTelemetry = async (farm_id) => {
  try {
    const [device] = await db.query("SELECT * FROM Device WHERE farm_id = ?", [farm_id]);
    const deviceIDs = device.map((device) => device.device_id); // Get all deviceIDs
    // Perform a query for each deviceID and fetch the latest timestamp
    const queries = deviceIDs.map((deviceID) =>
      dynamoDb.send(new QueryCommand({
        TableName: "TelemetryData",
        KeyConditionExpression: "device_id = :deviceID",
        ExpressionAttributeValues: {
          ":deviceID": deviceID
        },
        ScanIndexForward: false, // Sort by timestamp in descending order
        Limit: 1 // Only fetch the latest item
      }))
    );

    // Wait for all queries to complete
    const results = await Promise.all(queries);

    // Extract the latest data for each device
    const latestData = results.map((result) => result.Items[0]); // Take the first (latest) item from each result
    return latestData;
  } catch (error) {
    console.error("Error fetching latest telemetry for devices:", error);
    throw error;
  }
};

const getEnvironmentData = async () => {
  try {
    const [device] = await db.query("SELECT * FROM Device");
    const deviceIDs = device.map((device) => device.device_id); // Get all deviceIDs
    // Perform a query for each deviceID and fetch the latest timestamp
    const queries = deviceIDs.map((deviceID) =>
      dynamoDb.send(new QueryCommand({
        TableName: "EnvironmentData",
        KeyConditionExpression: "device_id = :deviceID",
        ExpressionAttributeValues: {
          ":deviceID": deviceID
        },
        ScanIndexForward: false, // Sort by timestamp in descending order
        Limit: 1 // Only fetch the latest item
      }))
    );

    // Wait for all queries to complete
    const results = await Promise.all(queries);
    // console.log(results);

    // Extract the latest data for each device
    const latestData = results.map((result) => result.Items[0]); // Take the first (latest) item from each result
    return latestData;
  } catch (error) {
    console.error("Error fetching latest telemetry for devices:", error);
    throw error;
  }
}

const getWaterFlowData = async (farm_id) => {
  try {
    const [device] = await db.query("SELECT * FROM Device WHERE farm_id = ?", [farm_id]);
    const deviceIDs = device.map((device) => device.device_id); // Get all deviceIDs
    // Perform a query for each deviceID and fetch the latest timestamp
    const queries = deviceIDs.map((deviceID) =>
      dynamoDb.send(new QueryCommand({
        TableName: "WaterFlowData",
        KeyConditionExpression: "device_id = :deviceID",
        ExpressionAttributeValues: {
          ":deviceID": deviceID
        },
        ScanIndexForward: false, // Sort by timestamp in descending order
        Limit: 1 // Only fetch the latest item
      }))
    );

    // Wait for all queries to complete
    const results = await Promise.all(queries);

    // Extract the latest data for each device
    const latestData = results.map((result) => result.Items[0]); // Take the first (latest) item from each result
    return latestData;
  } catch (error) {
    console.error("Error fetching latest telemetry for devices:", error);
    throw error;
  }
}

const getFieldIdbyDeviceId = async (device_id) => {
  const [device] = await db.query("SELECT id FROM Field WHERE farm_id = (SELECT farm_id FROM Device WHERE device_id = ?)", [device_id]);
  return device[0].id;
}

const getAutoWaterGate = async () => {
  const [auto_water_gate] = await db.query("SELECT device_id From Device WHERE id IN (SELECT device_id FROM WaterGateControl WHERE auto_mode = 1)");
  return auto_water_gate;
}

const getIdbyDeviceId = async (device_id) => {
  const [device] = await db.query("SELECT id FROM Device WHERE device_id = ?", [device_id]);
  return device[0].id;
}

module.exports = {
  createDevice,
  getDevice,
  getDevicebyId,
  createWaterGateControl,
  getWaterGateControl,
  getAllWaterGateControl,
  updateWaterGateControl,
  getTelemetry,
  getEnvironmentData,
  getWaterFlowData,
  getFieldIdbyDeviceId,
  getAutoWaterGate,
  getIdbyDeviceId
};