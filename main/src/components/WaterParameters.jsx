import React, { useState, useMemo, useEffect, useRef } from "react";
import useChart from "./useChart.jsx";
import { useOutletContext } from "react-router-dom";

// Assets
import ammoniaIcon from "/src/assets/monitoring-icons/ammonia.png";
import tempIcon from "/src/assets/monitoring-icons/temperature.png";
import pHIcon from "/src/assets/monitoring-icons/pH.png";
import DOIcon from "/src/assets/monitoring-icons/dissolved-oxygen.png";
import analyticsIcon from "/src/assets/monitoring-icons/analytics.png";

function WaterParameters() {
  // Sample data for chart for hourly readings
  const [chartType, setChartType] = useState("line");
  const [chart, setChart] = useState("ammonia");
  const chartFocus = useRef();
  const [chartPeriod, setChartPeriod] = useState("daily"); // "daily" or "weekly"
  const { tmpReadings, readings, schedArr } = useOutletContext();

  // create
  const temperatureReading = useMemo(
    () => ({
      labels: ["7:00AM", "9:00AM", "11:00AM", "1:00PM", "3:00PM", "5:00PM"],
      datasets: [
        {
          label: "Temperature (°C)",
          data: [25, 25, 27, 28, 27, 27],
          backgroundColor: "rgba(0, 255, 255, 0.2)", // translucent fill
          borderColor: "rgba(0, 157, 255, 1)", // vibrant line
          borderWidth: 3, // slightly thicker line
          pointBackgroundColor: "rgba(0, 255, 255, 1)",
          pointBorderColor: "#fff",
          pointRadius: 5,
          tension: 0.4, // smooth curves
          yAxisID: "y",
        },
      ],
    }),
    []
  );

  const sensorData1 = useMemo(() => {
    // Labels based on daily or weekly toggle
    const labels =
      chartPeriod === "daily"
        ? ["7:00AM", "9:00AM", "11:00AM", "1:00PM", "3:00PM", "5:00PM"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      temperature: {
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data:
              chartPeriod === "daily"
                ? [25, 25, 27, 28, 27, 27]
                : [26, 27, 26, 28, 27, 26, 27], // weekly sample
            backgroundColor: "rgba(0, 255, 255, 0.2)", // neon fill
            borderColor: "rgba(0, 157, 255, 1)", // vibrant line
            borderWidth: 3,
            pointBackgroundColor: "rgba(0, 255, 255, 1)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            tension: 0.4,
            yAxisID: "y",
          },
        ],
      },
      pH: {
        labels,
        datasets: [
          {
            label: "pH Level",
            data:
              chartPeriod === "daily"
                ? [7.0, 7.2, 7.1, 8.2, 8.1, 8.5]
                : [7.1, 7.2, 7.3, 7.4, 7.2, 7.3, 7.1],
            backgroundColor: "rgba(144, 238, 144, 0.2)", // translucent green
            borderColor: "rgba(67, 213, 67, 1)", // vibrant green line
            borderWidth: 3,
            pointBackgroundColor: "rgba(144, 238, 144, 1)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            tension: 0.4,
            yAxisID: "y1",
          },
        ],
      },
      ammonia: {
        labels,
        datasets: [
          {
            label: "Ammonia (ppm)",
            data:
              chartPeriod === "daily"
                ? [0.2, 0.0, 0.5, 0.3, 0.1, 0.5]
                : [0.3, 0.2, 0.5, 0.4, 0.3, 0.2, 0.1],
            backgroundColor: "rgba(255, 105, 180, 0.2)", // pinkish translucent
            borderColor: "rgba(255, 105, 180, 1)", // vibrant pink line
            borderWidth: 3,
            pointBackgroundColor: "rgba(255, 105, 180, 1)",
            pointBorderColor: "#fff",
            pointRadius: 5,
            tension: 0.4,
            yAxisID: "y2",
          },
        ],
      },
    };
  }, [chartPeriod]); // update when chartPeriod changes

  const sensorData = useMemo(() => {
    const labels =
      chartPeriod === "daily"
        ? ["7:00AM", "9:00AM", "11:00AM", "1:00PM", "3:00PM", "5:00PM"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const dailyReadings = readings?.sensors?.daily?.[todayDate] || {};
    const weeklyReadings = readings?.sensors?.weekly?.[thisWeek] || {};

    return {
      temperature: {
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data:
              chartPeriod === "daily"
                ? labels.map((l) => dailyReadings[l]?.temperature || 0)
                : labels.map((d) => weeklyReadings[d]?.avgTemperature || 0),
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            borderColor: "rgba(0, 157, 255, 1)",
            borderWidth: 3,
            pointRadius: 5,
            tension: 0.4,
            yAxisID: "y",
          },
        ],
      },
      pH: {
        labels,
        datasets: [
          {
            label: "pH Level",
            data:
              chartPeriod === "daily"
                ? labels.map((l) => dailyReadings[l]?.pH || 0)
                : labels.map((d) => weeklyReadings[d]?.avgPH || 0),
            backgroundColor: "rgba(144, 238, 144, 0.2)",
            borderColor: "rgba(67, 213, 67, 1)",
            borderWidth: 3,
            pointRadius: 5,
            tension: 0.4,
            yAxisID: "y1",
          },
        ],
      },
      ammonia: {
        labels,
        datasets: [
          {
            label: "Ammonia (ppm)",
            data:
              chartPeriod === "daily"
                ? labels.map((l) => dailyReadings[l]?.ammonia || 0)
                : labels.map((d) => weeklyReadings[d]?.avgAmmonia || 0),
            backgroundColor: "rgba(255, 105, 180, 0.2)",
            borderColor: "rgba(255, 105, 180, 1)",
            borderWidth: 3,
            pointRadius: 5,
            tension: 0.4,
            yAxisID: "y2",
          },
        ],
      },
    };
  }, [chartPeriod, readings]);

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

  const sensorOptions = useMemo(() => ({}), []);
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "Temperature (°C)" },
        },
        // y1: {
        //   type: "linear",
        //   position: "right",
        //   grid: { drawOnChartArea: false },
        //   title: { display: true, text: "pH" },
        // },
        // y2: {
        //   type: "linear",
        //   position: "right",
        //   grid: { drawOnChartArea: false },
        //   title: { display: true, text: "Ammonia (ppm)" },
        //   offset: true,
        // },
      },
    }),
    []
  );
  const chartRef = useChart(sensorData[chart], {}, chartType);
  return (
    <div className="water-parameter-data">
      <section className="sensor-data-section">
        <div className="sensor-data-container">
          <div onClick={activateChart}>
            <section>
              <h2>
                <img src={ammoniaIcon} />
                Ammonia level
              </h2>
              <h3 style={colorCode("ammonia", readings?.ammonia)}>
                {statusText("ammonia", readings?.ammonia)}
              </h3>
            </section>
            <p
              className="ammonia"
              style={colorCode("ammonia", readings?.ammonia, 1)}
            >
              {readings?.ammonia} ppm
            </p>
            <h3>Optimal Range: 0ppm</h3>
          </div>

          {/* pH sensor readings */}
          <div onClick={activateChart}>
            <section>
              <h2>
                <img src={pHIcon} />
                pH level
              </h2>
              <h3 style={colorCode("pH", readings?.pH)}>
                {statusText("pH", readings?.pH)}
              </h3>
            </section>

            <p className="pH" style={colorCode("pH", readings?.pH, 1)}>
              {readings?.pH}
            </p>
            <h3>Optimal Range: 7.0 - 7.5</h3>
          </div>

          {/* Temperature sensor readings */}
          <div onClick={activateChart}>
            <section>
              <h2>
                <img src={tempIcon} />
                Temperature
              </h2>
              <h3 style={colorCode("temperature", readings?.temperature)}>
                {statusText("temperature", readings?.temperature)}
              </h3>
            </section>

            <p
              className="temperature"
              style={colorCode("temperature", readings?.temperature, 1)}
            >
              {readings?.temperature} C
            </p>
            <h3>Optimal Range: 24 - 27</h3>
          </div>

          {/* Fish Behavior sensor readings */}
          <div>
            <section>
              <h2>
                <img src={DOIcon} />
                Dissolved Oxygen
              </h2>
              <h3 style={colorCode("fishBehavior", readings?.fishBehavior)}>
                {statusText("fishBehavior", readings?.fishBehavior)}
              </h3>
            </section>
            <p
              onClick={activateChart}
              style={colorCode("fishBehavior", readings?.fishBehavior, 1)}
            >
              {readings?.fishBehavior <= 3 ? "Normal" : "Above Normal"}
            </p>

            <h3>{readings?.fishBehavior} detections/min</h3>
            {/* <p className="fish-behavior-detection-rate">
              {readings.detectionRate} detection/min
            </p> */}
          </div>
        </div>
      </section>
      <section className="sensor-analytics-section" ref={chartFocus}>
        <h1>
          {" "}
          <img src={analyticsIcon} />
          Sensor Analytics
        </h1>
        <div className="chart-container">
          <canvas style={{ flex: "1", width: "100%" }} ref={chartRef} />
        </div>
        <div className="chart-descriptions">
          <div className="period-toggle-container">
            <label className="period-toggle">
              <input
                type="radio"
                name="period"
                value="daily"
                checked={chartPeriod === "daily"}
                onChange={() => setChartPeriod("daily")}
              />
              Daily
            </label>

            <label className="period-toggle">
              <input
                type="radio"
                name="period"
                value="weekly"
                checked={chartPeriod === "weekly"}
                onChange={() => setChartPeriod("weekly")}
              />
              Weekly
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WaterParameters;

// Function for styles (color code)
// Function for styles (color code)
const colorCode = (sensor, readings, val) => {
  if (readings === undefined) {
    return val === 1 ? { color: "#D3D3D3" } : { backgroundColor: "#D3D3D3" };
  }

  let styleColor = "#D3D3D3"; // fallback

  switch (sensor) {
    case "temperature": {
      // Optimal: 24–27 °C
      if (readings >= 24 && readings <= 27) {
        styleColor = "#118711ff"; // green
      } else if (
        (readings > 27 && readings <= 28) ||
        (readings < 24 && readings >= 22)
      ) {
        styleColor = "#8a9406ff"; // yellow
      } else {
        styleColor = "#de2e2e"; // red
      }
      break;
    }

    case "ammonia": {
      // Optimal: 0 ppm
      if (readings === 0) {
        styleColor = "#118711ff"; // green
      } else if (readings > 0 && readings <= 0.02) {
        styleColor = "#8a9406ff"; // yellow (slightly high but tolerable)
      } else {
        styleColor = "#de2e2e"; // red (bad)
      }
      break;
    }

    case "pH": {
      // Optimal: 7.0–7.5
      if (readings >= 7.0 && readings <= 7.5) {
        styleColor = "#118711ff"; // green
      } else if (
        (readings >= 6.8 && readings < 7.0) ||
        (readings > 7.5 && readings <= 7.7)
      ) {
        styleColor = "#8a9406ff"; // yellow
      } else {
        styleColor = "#de2e2e"; // red
      }
      break;
    }

    case "fishBehavior": {
      // Dissolved oxygen proxy → Optimal: 0–3 detections/min
      if (readings >= 0 && readings <= 3) {
        styleColor = "#118711ff"; // green
      } else {
        styleColor = "#de2e2e"; // red (too high)
      }
      break;
    }

    default:
      styleColor = "#D3D3D3";
  }

  return val === 1 ? { color: styleColor } : { backgroundColor: styleColor };
};

// Status Text
// Function for status text
const statusText = (sensor, readings) => {
  if (readings === undefined) return "No Data";

  switch (sensor) {
    case "temperature": {
      // Optimal: 24–27 °C
      if (readings >= 24 && readings <= 27) {
        return "Good";
      } else if (
        (readings > 27 && readings <= 28) ||
        (readings < 24 && readings >= 22)
      ) {
        return "Moderate";
      } else {
        return "Bad";
      }
    }

    case "ammonia": {
      // Optimal: 0 ppm
      if (readings === 0) {
        return "Good";
      } else if (readings > 0 && readings <= 0.02) {
        return "Moderate";
      } else {
        return "Bad";
      }
    }

    case "pH": {
      // Optimal: 7.0–7.5
      if (readings >= 7.0 && readings <= 7.5) {
        return "Good";
      } else if (
        (readings >= 6.8 && readings < 7.0) ||
        (readings > 7.5 && readings <= 7.7)
      ) {
        return "Moderate";
      } else {
        return "Bad";
      }
    }

    case "fishBehavior": {
      // Optimal: 0–3 detections/min
      if (readings >= 0 && readings <= 3) {
        return "Good";
      } else {
        return "Bad";
      }
    }

    default:
      return "Unknown";
  }
};
