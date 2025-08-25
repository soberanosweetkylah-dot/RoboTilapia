import React, { useState, useMemo, useEffect, useRef } from "react";
import useChart from "./useChart.jsx";

function WaterParameters({ tmpReadings, readings }) {
  // Sample data for chart for hourly readings
  const [chartType, setChartType] = useState("line");
  const [chart, setChart] = useState("ammonia");
  const chartFocus = useRef();
  // create
  const temperatureReading = useMemo(
    () => ({
      labels: ["7:00AM", "9:00AM", "11:00AM", "1:00PM", "3:00PM", "5:00PM"],
      datasets: [
        {
          label: "Temperature (°C)",
          data: [25, 25, 27, 28, 27, 27],
          backgroundColor: "rgba(135, 206, 250, 0.4)",
          borderColor: "rgba(135, 206, 250, 1)",
          borderWidth: 2,
          yAxisID: "y",
        },
      ],
    }),
    []
  ); // Only recompute if the values change

  const sensorData = useMemo(
    () => ({
      temperature: {
        labels: ["7:00AM", "9:00AM", "11:00AM", "1:00PM", "3:00PM", "5:00PM"],
        datasets: [
          {
            label: "Temperature (°C)",
            data: [25, 25, 27, 28, 27, 27],
            backgroundColor: "rgba(135, 206, 250, 0.4)",
            borderColor: "rgba(135, 206, 250, 1)",
            borderWidth: 2,
            yAxisID: "y",
          },
        ],
      },
      pH: {
        labels: ["7:00AM", "9:00AM", "11:00AM", "1:00PM", "3:00PM", "5:00PM"],
        datasets: [
          {
            label: "pH Level",
            data: [7.0, 7.2, 7.1, 8.2, 8.1, 8.5],
            backgroundColor: "rgba(144, 238, 144, 0.4)",
            borderColor: "rgba(144, 238, 144, 1)",
            borderWidth: 2,
            yAxisID: "y1",
          },
        ],
      },
      ammonia: {
        labels: ["7:00AM", "9:00AM", "11:00AM", "1:00PM", "3:00PM", "5:00PM"],
        datasets: [
          {
            label: "Ammonia (ppm)",
            data: [0.2, 0.0, 0.5, 0.3, 0.1, 0.5],
            backgroundColor: "rgba(255, 182, 193, 0.4)",
            borderColor: "rgba(255, 182, 193, 1)",
            borderWidth: 2,
            yAxisID: "y2",
          },
        ],
      },
    }),
    []
  );

  // Focus to chart and set chart
  const activateChart = (e) => {
    const readings = e.target.className;
    console.log(readings);
    setChart(readings);

  // Scroll to the chart section
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const sensorOptions = useMemo(()=>({}),[])
  // const options = useMemo(
  //   () => ({
  //     responsive: true,
  //     scales: {
  //       y: {
  //         type: "linear",
  //         position: "left",
  //         title: { display: true, text: "Temperature (°C)" },
  //       },
  //       // y1: {
  //       //   type: "linear",
  //       //   position: "right",
  //       //   grid: { drawOnChartArea: false },
  //       //   title: { display: true, text: "pH" },
  //       // },
  //       // y2: {
  //       //   type: "linear",
  //       //   position: "right",
  //       //   grid: { drawOnChartArea: false },
  //       //   title: { display: true, text: "Ammonia (ppm)" },
  //       //   offset: true,
  //       // },
  //     },
  //   }),
  //   []
  // );

  const chartRef = useChart(sensorData[chart], {}, chartType);
  return (
    <div className="water-parameter-data">
      <section className="sensor-data-section">
        <h1>Water Parameter Sensor Data</h1>
        <div className="sensor-data-container">
          <div onClick={activateChart}>
            <h2>Ammonia level</h2>
            <p className="ammonia">{readings?.ammonia} ppm</p>
          </div>

          {/* pH sensor readings */}
          <div onClick={activateChart}>
            <h2>pH Level</h2>
            <p className="pH">{readings?.pH}</p>
          </div>

          {/* Temperature sensor readings */}
          <div onClick={activateChart}>
            <h2>Temperature</h2>
            <p
              className="temperature"
              style={colorCode("temperature", readings?.temperature)}
            >
              {readings?.temperature} C
            </p>
          </div>

          {/* Fish Behavior sensor readings */}
          <div>
            <h2>Fish Behavior</h2>
            <p onClick={activateChart}>
              {readings?.fishBehavior >= 3 ? "Above Normal" : "Normal"}
            </p>
            {/* <p className="fish-behavior-detection-rate">
              {readings.detectionRate} detection/min
            </p> */}
          </div>
        </div>
      </section>
      <section className="sensor-analytics-section" ref={chartFocus}>
        <h1>Sensor Analytics</h1>
        <div className="chart-container">
          <canvas style={{ flex: "1", width: "100%" }} ref={chartRef} />
        </div>
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
