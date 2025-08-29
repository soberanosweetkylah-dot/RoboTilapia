import React from "react";
import DeleteBtn from "../assets/delete-btn.png";
import "../Dashboard.css";

function FeedingSchedule({ id, sched, onToggle, onSoftDelete, onHardDelete }) {
  return (
    <div id={`feeding-schedule-${id}`} className="feeding-schedule">
      {/* Toggle switch */}
      <div>
        <h1>
          <div className="container">
            <input
              type="checkbox"
              className="checkbox"
              id={id}
              checked={sched.isActive}
              onChange={() => onToggle(id, sched.isActive)}
            />
            <label className="switch" htmlFor={id}>
              <span className="slider"></span>
            </label>
          </div>
          <div>
            <h1>{sched.time}</h1>
            <p>{sched.amount}kg</p>
          </div>
        </h1>
      </div>

      {/* Delete button */}
      <button onClick={() => onHardDelete(id)} className="delete-schedule">
        <img src={DeleteBtn} alt="Delete" />
      </button>
    </div>
  );
}

export default FeedingSchedule;
