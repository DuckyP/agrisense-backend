const db = require('../config/dbConfig').db; // RDS database

const createFieldbyId = async ({farm_id, name, area, latitude, longitude, create_at}) => {
  await db.query(
    "INSERT INTO Field (farm_id, name, area, latitude, longitude, create_at) VALUES (?, ?, ?, ?, ?, ?)",
    [farm_id, name, area, latitude, longitude, create_at]
  );
};

const getField = async (farm_id) => {
  const [field] = await db.query("SELECT * FROM Field WHERE farm_id = ?", [farm_id]);
  return field;
}

const getFieldbyId = async (field_id) => {
  const [field] = await db.query("SELECT * FROM Field WHERE id = ?", [field_id]);
  return field;
}

const createRiceFieldData = async ({field_id, rice_variety, planting_start_date, harvest_date}) => {
  await db.query(
    "INSERT INTO RiceFieldData (field_id, rice_variety, planting_start_date, harvest_date) VALUES (?, ?, ?, ?)",
    [field_id, rice_variety, planting_start_date, harvest_date]
  );
};

const getRiceFieldData = async (field_id) => {
  const [riceFieldData] = await db.query("SELECT * FROM RiceFieldData WHERE field_id = ?", [field_id]);
  return riceFieldData;
}

const updateRiceFieldData = async ({data_id, harvest_date}) => {
  await db.query(
    "UPDATE RiceFieldData SET harvest_date = ? WHERE id = ?",
    [harvest_date, data_id]
  );
};

const createFertilizationData = async ({field_id, fertilization_date, fertilizer_type, quantity_applied, nitrogen_content, phosphorus_content, potassium_content, fertilization_method}) => {
  await db.query(
    "INSERT INTO FertilizationData (field_id, fertilization_date, fertilizer_type, quantity_applied, nitrogen_content, phosphorus_content, potassium_content, fertilization_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [field_id, fertilization_date, fertilizer_type, quantity_applied, nitrogen_content, phosphorus_content, potassium_content, fertilization_method]
  );
};

const getFertilizationData = async (field_id) => {
  const [fertilizationData] = await db.query("SELECT * FROM FertilizationData WHERE field_id = ?", [field_id]);
  return fertilizationData;
}

const createEmissionData = async ({field_id, date, water_level, methane, temperature, humidity, soil_moisture, sunlight, emission}) => {
  await db.query(
    "INSERT INTO EmissionData (field_id, date, water_level, methane, temperature, humidity, soil_moisture, sunlight, emission) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [field_id, date, water_level, methane, temperature, humidity, soil_moisture, sunlight, emission]
  );
};

const getEmissionData = async (field_id) => {
  const [emissionData] = await db.query("SELECT * FROM EmissionData WHERE field_id = ?", [field_id]);
  return emissionData;
}

const updateEmissionData = async (data) => {
  const [emissionData] = await db.query("SELECT * FROM EmissionData WHERE id = ?", [data["data_id"]]);
  for (const key of ["date", "water_level", "methane", "temperature", "humidity", "soil_moisture", "sunlight", "emission"]) {
    if (emissionData[0][key] != null && data[key] == null) {
      data[key] = emissionData[0][key];
    }
  }
  const {data_id, date, water_level, methane, temperature, humidity, soil_moisture, sunlight, emission} = data;
  await db.query(
    "UPDATE EmissionData SET date = ?, water_level = ?, methane = ?, temperature = ?, humidity = ?, soil_moisture = ?, sunlight = ?, emission = ? WHERE id = ?",
    [date, water_level, methane, temperature, humidity, soil_moisture, sunlight, emission, data_id]
  );
};

module.exports = {
  createFieldbyId,
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