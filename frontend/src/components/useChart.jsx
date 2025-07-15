import React, { useState, useEffect, useRef } from "react";
// Charts
import {
  Chart,
  LineController,
  BarController,
  PieController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineController,
  BarController,
  PieController,
  LineElement,
  BarElement,
  ArcElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);
function SensorChart(data, options, type = "line") {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Create chart or recreate if `type` changes
  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing instance before re-creating
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type,
        data,
        options,
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [type]); // Only re-create if `type` changes

  // Update data & options only
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data = data;
      chartInstance.current.options = options;
      chartInstance.current.update();
    }
  }, [data, options]);

  return chartRef;
}

export default SensorChart;
