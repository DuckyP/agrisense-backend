const farmServices = require('../services/farmServices');

const createFarm = async (req, res) => {
  const { farmer_id, description = null, area, totalRiceHarvest = null, create_at } = req.body;

  if (!farmer_id || area == null || !create_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await farmServices.createFarm({
      farmer_id,
      description,
      area,
      totalRiceHarvest,
      create_at,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getFarm = async (req, res) => {
  const { farmer_id } = req.params;

  try {
    const data = await farmServices.getFarm(farmer_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by farmer ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getFarmbyId = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const data = await farmServices.getFarmbyId(farm_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by farm ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateRiceHarvest = async (req, res) => {
  const { farm_id, totalRiceHarvest } = req.body;

  if (farm_id == null || totalRiceHarvest == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await farmServices.updateRiceHarvest({ farm_id, totalRiceHarvest });
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const createAddress = async (req, res) => {
  const { farm_id, house_no, street = null, village = null, sub_district, district, province, postcode, latitude, longitude, create_at } = req.body;

  if (!farm_id || !house_no || !sub_district || !district || !province || !postcode || latitude == null || longitude == null || !create_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Save to RDS
    await farmServices.createAddress({
      farm_id,
      house_no,
      street,
      village,
      sub_district,
      district,
      province,
      postcode,
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

const getAddress = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const data = await farmServices.getAddress(farm_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by farm ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const updateCarbonCredit = async (req, res) => {
  const { farm_id } = req.body;

  try {
    await farmServices.updateCarbonCredit({ farm_id });
    res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createFarm,
  getFarm,
  getFarmbyId,
  updateRiceHarvest,
  createAddress,
  getAddress,
  updateCarbonCredit,
};