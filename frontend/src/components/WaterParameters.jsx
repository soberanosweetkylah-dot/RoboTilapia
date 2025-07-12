import React from "react";
// BUG: There is something wrong with the overall layout dashboard
function WaterParameters({ sensorReadings, temp }) {
  return (
    <div className="water-parameter-data">
      <section className="sensor-data-section">
        <h1>Water Parameter Sensor Data</h1>
        <div className="sensor-data-container">
          <div className="ammonia-container">
            <h2>Ammonia level</h2>
            <p className="ammonia-readings">{sensorReadings.ammonia} ppm</p>
          </div>

          {/* pH sensor readings */}
          <div className="pH-container">
            <h2>pH Level</h2>
            <p className="pH-readings">{sensorReadings.pH}</p>
          </div>

          {/* Temperature sensor readings */}
          <div className="temperature-container">
            <h2>Temperature</h2>
            <p
              className="temperature-readings"
              style={colorCode("temperature", temp?.temperature)}
            >
              {temp?.temperature} C
            </p>
          </div>

          {/* Fish Behavior sensor readings */}
          <div className="fish-behavior-container">
            <h2>Fish Behavior</h2>
            <p className="fish-behavior-readings">
              {sensorReadings.detectionRate >= 3 ? "Above Normal" : "Normal"}
            </p>
            {/* <p className="fish-behavior-detection-rate">
              {sensorReadings.detectionRate} detection/min
            </p> */}
          </div>
        </div>
      </section>
      <section className="sensor-analytics-section">
        <h1>Sensor Analytics</h1>
        <p>Analyze the trends and patterns in your sensor data over time.</p>
      </section>
    </div>
  );
}

export default WaterParameters;

// Function for styles (color code)
const colorCode = (sensor, readings) => {
  if (readings === undefined) {
    return { color: "#D3D3D3" }; // Default color for undefined readings
  }
  switch (sensor) {
    case "temperature": {
      return readings >= 24 && readings <= 26
        ? { color: "#238823" }
        : (readings > 26 && readings <= 28) || (readings < 24 && readings >= 22)
        ? { color: "#FFBF00" }
        : { color: "#D2222D" };
    }
  }
};
