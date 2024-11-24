const cron = require('node-cron');
const fieldServices = require('./fieldServices');
const deviceServices = require('./deviceServices');

// Schedule the task to run every 15 minutes
// cron.schedule('*/15 * * * *', async () => {
cron.schedule('*/30 * * * * *', async () => {
  console.log('Running database update task');
  let environmentData = await deviceServices.getEnvironmentData();
  environmentData = environmentData.filter(item => item !== undefined);
  // Update Emission data
  // console.log('Environment data:', environmentData);
  const data = await Promise.all(environmentData.map(async (data) => ({
    device_id: data.device_id,
    field_id: await deviceServices.getFieldIdbyDeviceId(data.device_id),
    methane: data.device_data.ch4,
    temperature: data.device_data.temp,
    humidity: data.device_data.humidity,
    sunlight: data.device_data.sunlight,
    water_level: data.device_data.level,
    timestamp: new Date(data.timestamp)
  })));
  // console.log('Data:', data);
  await Promise.all(data.map(async (data) => {
    await fieldServices.createEmissionData({
      field_id: data.field_id,
      date: data.timestamp,
      methane: data.methane,
      temperature: data.temperature,
      humidity: data.humidity,
      sunlight: data.sunlight,
      water_level: data.water_level
    });
  }));

  // Update Water gate control
  const auto_water_gate = await deviceServices.getAutoWaterGate();
  console.log('Auto water gate:', auto_water_gate);
  for (let i = 0; i < auto_water_gate.length; i++) {
    const water_level = data.find(item => item.device_id === auto_water_gate[i].device_id).water_level;
    const device_id = await deviceServices.getIdbyDeviceId(auto_water_gate[i].device_id);
    console.log('Water level:', water_level);
    if (water_level < 10) {
      await deviceServices.updateWaterGateControl({device_id, status: 'ON', open_time: new Date()});
      console.log('Turning water gate ON');
    } else if (water_level > 13) {
      await deviceServices.updateWaterGateControl({device_id, status: 'OFF', close_time: new Date()});
      console.log('Turning water gate OFF');
    }
  }
});
