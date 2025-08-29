import React, { useEffect, useState } from "react";
import FeedingSchedule from "./FeedingSchedule.jsx";
import { useOutletContext } from "react-router-dom";

// Assets
import feedLevel from "/src/assets/monitoring-icons/feed-level.png";
import feedSchedInput from "/src/assets/monitoring-icons/feed-sched-input.png";
import feedSchedIcon from "/src/assets/monitoring-icons/feeding-sched.png";
import nextFeedSched from "/src/assets/monitoring-icons/next-feed-sched.png";

import {
  useReadDatabase,
  useAddSchedule,
  useUpdateSchedule,
  useSoftDeleteSchedule,
  useDeleteSchedule,
} from "./utils.jsx";

function FeedingManagement() {
  const { readings } = useOutletContext();
  const defaultFeedingSchedule = [
    { schedId: 1, time: "7:30", amount: 0.5 },
    { schedId: 2, time: "16:30", amount: 0.5 },
  ];

  // 🔹 Get schedules directly from DB
  const feedingSchedules = useReadDatabase(
    "/machines/machine0/feedingSched/custom"
  );
  // const defaultFeedSchedules = useReadDatabase(
  //   "/machines/machine0/feedingSched/default"
  // );
  console.log(feedingSchedules.readings);

  const { addSchedule } = useAddSchedule("machine0");
  const { updateSchedule } = useUpdateSchedule("machine0");
  const { softDeleteSchedule } = useSoftDeleteSchedule("machine0");
  const { deleteSchedule } = useDeleteSchedule("machine0");
  const [feedSched, setFeedSched] = useState({ feedSched: "", feedAmount: 0 });

  // ✅ Add schedule
  const handleAddSchedule = (e) => {
    e.preventDefault();
    const { feedAmount } = feedSched;
    if (
      !feedSched.feedSched ||
      !feedSched.feedAmount ||
      feedSched.feedAmount <= 0 ||
      feedSched.feedAmount >= 1
    ) {
      return alert("Please enter a valid feed amount between 0.01 and 0.99 kg");
    }
    addSchedule(feedSched.feedSched, feedSched.feedAmount);
    setFeedSched({ feedSched: "", feedAmount: 0 });
  };

  const handleToggle = (schedId, currentStatus) => {
    updateSchedule(schedId, { isActive: !currentStatus });
  };

  const handleSoftDeleteSched = (schedId) => {
    softDeleteSchedule(schedId);
  };

  const handleHardDeleteSched = (schedId) => {
    deleteSchedule(schedId);
  };

  const [schedArr, setSchedArr] = useState([]);

  useEffect(() => {
    if (feedingSchedules.readings) {
      setSchedArr(Object.values(feedingSchedules.readings));
    }
  }, [feedingSchedules.readings]);

  // Count of active and deleted schedules
  const [count, setCount] = useState({ activeCount: 0, deletedCount: 0 });

  useEffect(() => {
    let active = 0;
    let deleted = 0;

    schedArr.forEach((sched) => {
      if (sched.isDeleted) deleted++;
      if (sched.isActive) active++;
    });

    setCount({ activeCount: active, deletedCount: deleted });
  }, [schedArr]);

  console.log(schedArr);
  console.log(feedingSchedules.readings);
  console.log(readings);

  return (
    <>
      {/* Loading layout */}
      {!readings && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <section className="dots-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </section>
        </div>
      )}

      <div className="feeding-management">
        <div className="feeding-data">
          <div className="feed-management-container">
            <section>
              <div className="feed-level-status-container">
                <h2>
                  <img src={feedLevel} />
                  Feed Level
                </h2>
                <p
                  className="feed-level-percentage"
                  style={colorCode(readings.feedLevel)}
                >
                  {readings.feedLevel}%
                </p>
                <p>{refillMessage(readings.feedLevel)}</p>
              </div>
              <div className="next-feed-level-status-container">
                <h2>
                  <img src={nextFeedSched} />
                  Feed Schedule Status
                </h2>
                <div>
                  {(() => {
                    // Filter out deleted schedules and only include active ones
                    const activeScheds = schedArr
                      .filter((s) => !s.isDeleted && s.isActive)
                      .sort((a, b) => a.time.localeCompare(b.time));

                    if (activeScheds.length >= 2) {
                      const currentSched = activeScheds[0];
                      const nextSched = activeScheds[1];

                      return (
                        <>
                          <h1>
                            Current Schedule: {currentSched.time}
                            <p>Feed amount: {currentSched.amount}kg</p>
                          </h1>
                          <h1 style={{ opacity: "0.2" }}>
                            Next Schedule: {nextSched.time}
                            <p>Feed amount: {nextSched.amount}kg</p>
                          </h1>
                        </>
                      );
                    } else {
                      // Fallback to default if fewer than 2 active schedules
                      return (
                        <>
                          <h1>
                            Current Schedule: {defaultFeedingSchedule[0].time}
                            <p>
                              Feed amount: {defaultFeedingSchedule[0].amount}kg
                            </p>
                          </h1>
                          {defaultFeedingSchedule[1] && (
                            <h1 style={{ opacity: "0.2" }}>
                              Next Schedule: {defaultFeedingSchedule[1].time}
                              <p>
                                Feed amount: {defaultFeedingSchedule[1].amount}
                                kg
                              </p>
                            </h1>
                          )}
                        </>
                      );
                    }
                  })()}
                </div>
              </div>
            </section>

            <form
              onSubmit={handleAddSchedule}
              className="feed-input-schedule-container"
            >
              <h2>
                <img src={feedSchedInput} />
                Feed Input
              </h2>
              <label>Input time and Feed Amount in Kilograms</label>
              <input
                id="feeding-input-time"
                type="time"
                value={feedSched.feedSched || ""}
                onChange={(e) =>
                  setFeedSched((rec) => ({ ...rec, feedSched: e.target.value }))
                }
                required
              />
              <div>
                <input
                  type="number"
                  placeholder="Feed Amount (kg)"
                  step="0.01"
                  value={feedSched.feedAmount || ""}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, ""); // remove non-numbers
                    value = parseFloat(value);

                    if (isNaN(value) || value <= 0) {
                      value = ""; // empty for invalid numbers
                    } else if (value > 0.99) {
                      value = 0.99; // cap at 0.99
                    } else {
                      // round/truncate to 2 decimal places
                      value = Math.floor(value * 100) / 100;
                    }

                    setFeedSched((rec) => ({ ...rec, feedAmount: value }));
                  }}
                  required
                />

                <input id="feeding-submit-btn" type="submit" />
              </div>
            </form>
          </div>
        </div>

        <div className="feeding-schedule-container">
          <div>
            <h1>
              <img src={feedSchedIcon} />
              Feeding Schedule
            </h1>
            <h1>
              {count.activeCount < 2
                ? "Default Schedule"
                : "Customized Schedule"}
            </h1>
          </div>

          <div className="feeding-schedule-scrollable">
            {feedingSchedules.loading && <p>Loading schedules...</p>}
            {!feedingSchedules.loading &&
              schedArr.map((sched) => {
                if (sched.isDeleted) return null;
                return (
                  <FeedingSchedule
                    key={sched.schedId}
                    id={sched.schedId}
                    sched={sched}
                    onToggle={handleToggle}
                    onSoftDelete={handleSoftDeleteSched}
                    onHardDelete={handleHardDeleteSched}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default FeedingManagement;

// ------------------ COLOR CODE FUNCTION ------------------
const colorCode = (feedLevel) => {
  if (feedLevel === undefined || feedLevel === null) {
    return { color: "#D3D3D3" }; // Default gray for no data
  }
  if (feedLevel < 50) return { color: "#de2e2eff" };
  if (feedLevel >= 50 && feedLevel <= 70) return { color: "#8a9406ff" };
  return { color: "#3bcb3bff" };
};

// ------------------ REFILL MESSAGE FUNCTION ------------------
const refillMessage = (feedLevel) => {
  if (feedLevel === undefined || feedLevel === null) {
    return "No data";
  }
  if (feedLevel < 50) return "⚠️ Refill now!";
  if (feedLevel >= 50 && feedLevel <= 70) return "ℹ️ Monitor level";
  return "✅ Sufficient";
};
