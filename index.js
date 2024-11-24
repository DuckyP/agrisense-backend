const express = require("express");
const farmerRoutes = require("./routes/farmerRoutes");
const farmRoutes = require("./routes/farmRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const mqttRoutes = require("./routes/mqttRoutes");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

require("./services/schedulerServices");

const app = express();
app.use(bodyParser.json());

const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use farmer routes
app.use("/farmer", farmerRoutes);
app.use("/farm", farmRoutes);
app.use("/field", fieldRoutes);
app.use("/device", deviceRoutes);
app.use('/mqtt', mqttRoutes);

// Start Server
const PORT = 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
