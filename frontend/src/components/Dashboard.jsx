import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
// CSS
import "../Dashboard.css";
import "../Transition.css";

// Assets
import ProfilePic from "../assets/profile-pic.png";
import MenuBtn from "../assets/menu.png";
import TilapiaBG from "../assets/tilapia-bg.png";
import CloseBtnLight from "../assets/close-btn-light.png";
import CloseBtnDark from "../assets/close-btn-dark.png";

// Key components
import WaterParameters from "./WaterParameters.jsx";
import RealTimeClock from "./RealTimeClock.jsx";
import FeedingManagement from "./FeedingManagement.jsx";

// utilities
import { useAnimatedToggle, useReadDatabase } from "./utils.jsx";

// DRY: Custom hook for toggling modals/sidebars with animation
function Dashboard() {
  // TODO Add the user object from the homepage here for rendering of profile
  // Sample sched array (should use useState for dynamic updates)
  const [schedArr, setSchedArr] = useState([
    { schedId: Date.now() + 1, time: "12:30 AM", isDeleted: false },
    { schedId: Date.now() + 2, time: "12:20 AM", isDeleted: false },
    { schedId: Date.now() + 3, time: "12:10 AM", isDeleted: false },
  ]);
  const [tmpReadings, setTmpreadings] = useState({
    ammonia: 0.5,
    pH: 7.9,
    temperature: 25,
    detectionRate: 3,
    feedLevel: 50,
  });

  // DRY: Use custom hook for sidebar and signout modal

  const { readings, setReadings } = useReadDatabase();
  useEffect(() => {
    console.log(readings);
  }, []);
  const sidebar = useAnimatedToggle(300);
  const signout = useAnimatedToggle(300);
  const closeSignoutSideBar = () => {
    sidebar.close();
    signout.close();
  };

  // Closes sign out and modal when pressed esc
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (signout.shouldRender) signout.close();
        else if (sidebar.shouldRender) sidebar.close();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [signout.shouldRender, sidebar.shouldRender, signout, sidebar]);

  return (
    <>
      {/* Sidebar */}
      {sidebar.shouldRender && (
        <div
          className={`side-bar-navigation ${
            sidebar.animating ? "slide-in" : "slide-out"
          }`}
          onClick={(e) => {
            // Only close if clicking the background, not a child
            if (e.target.classList.contains("side-bar-navigation"))
              sidebar.close();
          }}
        >
          <button className="close-side-bar" onClick={sidebar.close}>
            <img src={CloseBtnLight} />
          </button>
          <nav>
            <h1 className="user-profile">Profile</h1>
            <h1 className="settings">Settings</h1>
            <h1 className="Help">Help</h1>
            <h1 className="Logout" onClick={signout.open}>
              Logout
            </h1>
          </nav>
        </div>
      )}
      {/* Signout modal */}
      {signout.shouldRender && (
        <>
          <div
            className={`sign-out-layout ${
              signout.animating ? "fade-in" : "fade-out"
            }`}
            onClick={signout.close}
          ></div>
          <div
            className={`sign-out-modal ${
              signout.animating ? "fade-in" : "fade-out"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Are you sure you want to sign out?</h1>
            <button className="confirm-sign-out">
              {/* Transition to Homepage */}
              <Link className="link-homepage" to="/">
                Yes
              </Link>
            </button>
            <button className="cancel-sign-out" onClick={closeSignoutSideBar}>
              No
            </button>
            <button
              className="close-sign-out-modal"
              onClick={closeSignoutSideBar}
            >
              <img src={CloseBtnDark} />
            </button>
          </div>
        </>
      )}
      {/* MAIN DASHBOARD */}
      <div className="dashboard">
        <div className="tilapia-bg-layout">
          <img src={TilapiaBG} />
        </div>
        <div className="top-bar">
          <section className="profile-section">
            <img
              className="profile-pic"
              src={ProfilePic}
              alt="profile"
              title="profile picture"
            />
            <div className="profile-description">
              <h3>Welcome back, Tilapia Farmer 1</h3>
              <h4>profilename@gmail.com</h4>
            </div>
          </section>
          {/* Real Time Clock */}
          <RealTimeClock />
          <button className="menu" onClick={sidebar.open}>
            <img src={MenuBtn} />
          </button>
        </div>
        <div className="content-section">
          {/* Water Parameter Monitoring Section */}
          <WaterParameters sensorReadings={tmpReadings} temp={readings} />
          {/* Feeding Management Section */}
          <FeedingManagement
            sensorReadings={tmpReadings}
            feedingSched={schedArr}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
