const farmerService = require("../services/farmerServices");
const bcrypt = require('bcryptjs');

const salt = 10; // Typically a value between 10 and 12

const createFarmer = async (req, res) => {
  const { username, email, password, firstname, lastname, telephone, create_at } = req.body;

  if (!username || !email || !password || !firstname || !lastname || !telephone || !create_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const hashed_password = async (password) => {
    return await bcrypt.hash(password, salt);
  };

  try {
    // Save to RDS
    await farmerService.createFarmer({
      username,
      email,
      password: await hashed_password(password),
      first_name: firstname,
      last_name: lastname,
      telephone,
      create_at,
    });
    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error storing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFarmerById = async (req, res) => {
  const { farmer_id } = req.params;
  console.log(farmer_id);

  try {
      const data = await farmerService.getFarmerById(farmer_id);
      res.status(200).json(data);
  } catch (error) {
      console.error("Error fetching data by farmer ID:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user data from the service
    const data = await farmerService.login(username);

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, data[0]["password"]);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Respond with success if passwords match
    const farmer_id = await farmerService.getFarmerIdByUsername(username);
    res.status(200).json(farmer_id);
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const createAddress = async (req, res) => {
  const { farmer_id, house_no, street = null, village = null, sub_district, district, province, postcode, latitude, longitude, create_at } = req.body;

  if (!farmer_id || !house_no || !sub_district || !district || !province || !postcode || latitude == null || !longitude == null || !create_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await farmerService.createAddress({
      farmer_id,
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
};

const getAddress = async (req, res) => {
  const { farmer_id } = req.params;

  try {
    const data = await farmerService.getAddress(farmer_id);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by farmer ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createFarmer,
  getFarmerById,
  login,
  createAddress,
  getAddress,
};