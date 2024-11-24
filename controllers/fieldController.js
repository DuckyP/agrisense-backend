const fieldServices = require("../services/fieldServices");

const createField = async (req, res) => {
  const { farm_id, name = null, area, latitude, longitude, create_at } = req.body;

  if (!farm_id || area == null || latitude == null || longitude == null || !create_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await fieldServices.createFieldbyId({
      farm_id,
      name,
      area,
      latitude,
      longitude,
      create_at,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getField = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const data = await fieldServices.getField(farm_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by farm ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getFieldbyId = async (req, res) => {
  const { field_id } = req.params;

  try {
    const data = await fieldServices.getFieldbyId(field_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by field ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createRiceFieldData = async (req, res) => {
  const { field_id, rice_variety, planting_start_date, harvest_date = null } = req.body;

  if (!field_id || !rice_variety || !planting_start_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await fieldServices.createRiceFieldData({
      field_id,
      rice_variety,
      planting_start_date,
      harvest_date,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getRiceFieldData = async (req, res) => {
  const { field_id } = req.params;

  try {
    const data = await fieldServices.getRiceFieldData(field_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by field ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateRiceFieldData = async (req, res) => {
  const { data_id, harvest_date } = req.body;

  if (!data_id || !harvest_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await fieldServices.updateRiceFieldData({ data_id, harvest_date });
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createFertilizationData = async (req, res) => {
  const { field_id, fertilization_date, fertilizer_type = null, quantity_applied = null, nitrogen_content = null, phosphorus_content = null, potassium_content = null, fertilization_method = null } = req.body;

  if (!field_id || !fertilization_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await fieldServices.createFertilizationData({
      field_id,
      fertilization_date,
      fertilizer_type,
      quantity_applied,
      nitrogen_content,
      phosphorus_content,
      potassium_content,
      fertilization_method,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getFertilizationData = async (req, res) => {
  const { field_id } = req.params;

  try {
    const data = await fieldServices.getFertilizationData(field_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by field ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createEmissionData = async (req, res) => {
  const { field_id, date, water_level = null, methane = null, temperature = null, humidity = null, soil_moisture = null, sunlight = null, emission = null } = req.body;

  if (!field_id || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await fieldServices.createEmissionData({
      field_id,
      date,
      water_level,
      methane,
      temperature,
      humidity,
      soil_moisture,
      sunlight,
      emission,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getEmissionData = async (req, res) => {
  const { field_id } = req.params;

  try {
    const data = await fieldServices.getEmissionData(field_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by field ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateEmissionData = async (req, res) => {
  const { data_id, date = null, water_level = null, methane = null, temperature = null, humidity = null, soil_moisture = null, sunlight = null, emission = null } = req.body;

  if (!data_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await fieldServices.updateEmissionData({ data_id, date, water_level, methane, temperature, humidity, soil_moisture, sunlight, emission });
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createField,
  getField,
  getFieldbyId,
  createRiceFieldData,
  getRiceFieldData,
  updateRiceFieldData,
  createFertilizationData,
  getFertilizationData,
  createEmissionData,
  getEmissionData,
  updateEmissionData,
};