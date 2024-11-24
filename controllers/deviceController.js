const deviceServices = require("../services/deviceServices");

const createDevice = async (req, res) => {
  const { farm_id, device_id, name = null, type, latitude, longitude } = req.body;

  if (!farm_id || !device_id || !type || latitude == null || longitude == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await deviceServices.createDevice({
      farm_id,
      device_id,
      name,
      type,
      latitude,
      longitude,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getDevice = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const data = await deviceServices.getDevice(farm_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by farm ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getDevicebyId = async (req, res) => {
  const { device_id } = req.params;

  try {
    const data = await deviceServices.getDevicebyId(device_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by device ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createWaterGateControl = async (req, res) => {
  const { device_id, field_id, name = null, flow_direction = null, status, flow_rate = null, open_time = null, close_time = null, auto_mode = null } = req.body;

  if (!device_id || !field_id || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await deviceServices.createWaterGateControl({
      device_id,
      field_id,
      name,
      flow_direction,
      status,
      flow_rate,
      open_time,
      close_time,
      auto_mode,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getWaterGateControl = async (req, res) => {
  const { device_id } = req.params;

  try {
    const data = await deviceServices.getWaterGateControl(device_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by device ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getAllWaterGateControl = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const data = await deviceServices.getAllWaterGateControl(farm_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by farm ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateWaterGateControl = async (req, res) => {
  const { device_id, flow_rate = null, status = null, auto_mode = null, open_time = null, close_time = null } = req.body;

  if (!device_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await deviceServices.updateWaterGateControl({
      device_id,
      flow_rate,
      status,
      auto_mode,
      open_time,
      close_time,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getTelemetry = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const data = await deviceServices.getTelemetry(farm_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by device ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
};