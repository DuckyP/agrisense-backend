const db = require('../config/dbConfig').db; // RDS database

function carbonCalculator({ CH4soil_vars, CO2_vars, N2Osoil_vars }) {
  const water_management_factor = { full: 1, once: 0.71, multiple: 0.55 };
  const n2o_emission_factor = { flooded: 0.003, drained: 0.005 };
  let BEy = 1000, PEy, LEy = 0, Ud = 0.15;
  let PEs, CH4soil, CO2lime, CO2urea, N2Osoil, CO2fuel = 0, GHG = 0;
  const { area_rai, growing_days } = CH4soil_vars;
  const { lime_amount, urea_amount, fuel_amount } = CO2_vars;
  const { N_chem, N_fert } = N2Osoil_vars;
  const ch4_emission_rate = (1.3/6.25)*0.25;
  CH4soil = area_rai * growing_days * ch4_emission_rate * water_management_factor.multiple;
  CO2lime = lime_amount * 0.12;
  CO2urea = urea_amount * 0.20;
  N2Osoil = (N_chem + N_fert) * n2o_emission_factor.drained;
  PEs = CH4soil + CO2lime + CO2urea + N2Osoil + CO2fuel + GHG;
  PEy = PEs * 3;
  const ERy = (BEy - PEy - LEy) * (1 - Ud);
  return ERy;
}

function getDayDifference(date1, date2) {
  // Convert the dates to timestamp (in milliseconds)
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();

  // Calculate the difference in milliseconds
  const diffInMs = Math.abs(time2 - time1);

  // Convert milliseconds to days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return Math.floor(diffInDays); // Round down to the nearest whole number
}

const updateCarbonCredit = async ({farm_id}) => {
  const [farm] = await db.query("SELECT * FROM Farm WHERE id = ?", [farm_id]);
  const [riceFieldData] = await db.query("SELECT * FROM RiceFieldData WHERE field_id IN (SELECT id FROM Field WHERE farm_id = ?)", [farm_id]);
  const CH4soil_vars = {area_rai: farm[0].area, growing_days: (riceFieldData[0].planting_start_date != null && riceFieldData[0].harvest_date != null) ? getDayDifference(riceFieldData[0].planting_start_date, riceFieldData[0].harvest_date) : 120};
  const CO2_vars = {lime_amount: 0, urea_amount: 108.7, fuel_amount: 0};
  const N2Osoil_vars = {N_chem: 108.7, N_fert: 0};
  // const carbon = carbonCalculator({CH4soil_vars, CO2_vars, N2Osoil_vars});
  const carbon = farm[0].area * 0.3;
  console.log("Carbon Credit:", carbon);
  await db.query(
    "UPDATE Farm SET carboncredit = ? WHERE id = ?",
    [carbon, farm_id]
  );
}

const getCarbonFootprint = async (farm_id) => {
  const [farm] = await db.query("SELECT * FROM Farm WHERE id = ?", [farm_id]);
  return farm[0].carbonFootprint;
}

const createFarm = async ({farmer_id, description, area, totalRiceHarvest, create_at}) => {
  await db.query(
    "INSERT INTO Farm (farmer_id, description, area, totalRiceHarvest, create_at) VALUES (?, ?, ?, ?, ?)",
    [farmer_id, description, area, totalRiceHarvest, create_at]
  );
}

const getFarm = async (farmer_id) => {
  const [farm] = await db.query("SELECT * FROM Farm WHERE farmer_id = ?", [farmer_id]);
  return farm;
}

const getFarmbyId = async (farm_id) => {
  const [farm] = await db.query("SELECT * FROM Farm WHERE id = ?", [farm_id]);
  return farm;
}

const updateRiceHarvest = async ({farm_id, totalRiceHarvest}) => {
  await db.query(
    "UPDATE Farm SET totalRiceHarvest = ? WHERE id = ?",
    [totalRiceHarvest, farm_id]
  );
}

const createAddress = async ({farm_id, house_no, street, village, sub_district, district, province, postcode, latitude, longitude, create_at}) => {
  await db.query(
    "INSERT INTO FarmAddress (farm_id, house_no, street, village, sub_district, district, province, postcode, latitude, longitude, create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [farm_id, house_no, street, village, sub_district, district, province, postcode, latitude, longitude, create_at]
  );
}

const getAddress = async (farm_id) => {
  const [address] = await db.query("SELECT * FROM FarmAddress WHERE farm_id = ?", [farm_id]);
  return address;
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