const db = require('../config/dbConfig').db; // RDS database

const createFarmer = async ({username, email, password, first_name, last_name, telephone, create_at}) => {
  await db.query(
    "INSERT INTO Farmer (username, email, password, first_name, last_name, telephone, create_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [username, email, password, first_name, last_name, telephone, create_at]
  );
};

const getFarmerById = async (farmer_id) => {
  const [farmer] = await db.query("SELECT * FROM Farmer WHERE id = ?", [farmer_id]);
  return farmer;
};

const getFarmerIdByUsername = async (username) => {
  const [farmer] = await db.query("SELECT id FROM Farmer WHERE username = ?", [username]);
  return farmer;
};

const login = async (username) => {
  const [data] = await db.query("SELECT password FROM Farmer WHERE username = ?", [username]);
  return data;
}

const createAddress = async ({farmer_id, house_no, street, village, sub_district, district, province, postcode, latitude, longitude, create_at}) => {
  await db.query(
    "INSERT INTO HomeAddress (farmer_id, house_no, street, village, sub_district, district, province, postcode, latitude, longitude, create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [farmer_id, house_no, street, village, sub_district, district, province, postcode, latitude, longitude, create_at]
  );
}

const getAddress = async (farmer_id) => {
  const [address] = await db.query("SELECT * FROM HomeAddress WHERE farmer_id = ?", [farmer_id]);
  return address;
}

module.exports = {
    createFarmer,
    getFarmerById,
    getFarmerIdByUsername,
    login,
    createAddress,
    getAddress,
};
