import React from "react";
import { useState, useEffect } from "react";

function RealTimeClock() {
  // Real-time clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  // Format date and time
  const dateString = currentTime.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeString = currentTime.toLocaleTimeString();
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <section className="time-date">
        <h1 className="date-top-bar">{dateString}</h1>
        <h1 className="time-top-bar">{timeString}</h1>
      </section>
    </>
  );
}

export default RealTimeClock;

