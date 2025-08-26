import React from "react";
import FeedingSchedule from "./FeedingSchedule.jsx";

function FeedingManagement({ sensorReadings, feedingSched }) {
  return (
    <div className="feeding-management">
      <div className="feeding-data">
        <h1>Feeding Management</h1>
        <div className="feed-management-container">
          <div className="feed-level-status-container">
            <h2>Feed Level</h2>
            <p className="feed-level-percentage">{sensorReadings.feedLevel}%</p>
            {/* <p className="feed-level-description">Close to being empty</p> */}
          </div>
          <form className="feed-input-schedule-container">
            <h2>Feed Input</h2>
            <input id="feeding-input-time" type="time" />
            <input id="feeding-submit-btn" type="submit" />
          </form>
        </div>
      </div>
      <div className="feeding-schedule-container">
        <h1>Feeding Schedule</h1>
        <div className="feeding-schedule-scrollable">
          {feedingSched.map((sched, i) => {
            if (sched.isDeleted) return null;
            return (
              <FeedingSchedule
                key={sched.schedId}
                id={sched.schedId}
                sched={sched}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FeedingManagement;
