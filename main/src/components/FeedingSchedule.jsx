import React from "react";
import DeleteBtn from "../assets/delete-btn.png"; //feeding schedule
import "../Dashboard.css";

function FeedingSchedule({ sched, id }) {
  return (
    <div id={`feeding-schedule-${id}`} className="feeding-schedule">
      <h1>{sched.time}</h1>
      <button className="delete-schedule">
        <img src={DeleteBtn} alt="Delete" />
      </button>
    </div>
  );
}

export default FeedingSchedule;
