import { useState, useEffect } from "react";
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

// Real Time Database
import app from "../firebase.js";
import { getDatabase, ref, set, push } from "firebase/database"; //Realtime database

function Dashboard() {
  // TODO Add the user object from the homepage here for rendering of profile
  // Sample sched array (should use useState for dynamic updates)
  const [schedArr, setSchedArr] = useState([
    { schedId: Date.now() + 1, time: "12:30 AM", isDeleted: false },
    { schedId: Date.now() + 2, time: "12:20 AM", isDeleted: false },
    { schedId: Date.now() + 3, time: "12:10 AM", isDeleted: false },
  ]);
  const [readings, setReadings] = useState({
    ammonia: 0.5,
    pH: 7.9,
    temperature: 25,
    detectionRate: 3,
    feedLevel: 50,
  });
  // Database
  const saveData = () => {
    const db = getDatabase(ref);
  };

  // For toggling side-bar
  // TODO DRY ALERT Objects here
  const [sidebarState, setSidebarState] = useState({
    visible: false,
    animating: false,
  });
  // For toggling sig-out-modal
  const [showSignOut, setShowSignOut] = useState(false);
  const [signOutFade, setSignOutFade] = useState(false);

  // TODO should the objects be in one place?
  // Sidebar animation state and handlers as an object
  const sidebar = {
    visible: sidebarState.visible,
    animating: sidebarState.animating,
    open: () => setSidebarState({ visible: true, animating: true }),
    close: () => {
      setSidebarState((prev) => ({ ...prev, animating: false }));
      setTimeout(
        () => setSidebarState({ visible: false, animating: false }),
        300
      );
    },
    shouldRender: sidebarState.visible || sidebarState.animating,
    getClass: () =>
      `side-bar-navigation ${
        sidebarState.animating ? "slide-in" : "slide-out"
      }`,
  };
  // signout functions
  const signout = {
    open: () => {
      setShowSignOut(true);
      setSignOutFade(true);
    },
    close: () => {
      setSignOutFade(false);
      setTimeout(() => {
        setShowSignOut(false);
        sidebar.close(); // Also close the sidebar
      }, 300);
    },
  };
  // Closes sign out and modal when pressed esc
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (showSignOut) signout.close();
        else if (sidebar.shouldRender) sidebar.close();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSignOut, sidebar.shouldRender]);

  return (
    <>
      {sidebar.shouldRender && (
        <div
          className={sidebar.getClass()}
          onClick={(e) => {
            // Only close if clicking the background, not a child
            if (e.target.classList.contains("side-bar-navigation"))
              sidebar.close();
            console.log(e);
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
      {showSignOut && (
        <>
          <div
            className={`sign-out-layout ${
              signOutFade ? "fade-in" : "fade-out"
            }`}
            onClick={signout.close}
          ></div>
          <div
            className={`sign-out-modal ${signOutFade ? "fade-in" : "fade-out"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Are you sure you want to sign out?</h1>
            <button className="confirm-sign-out">
              {/* Transition to Homepage */}
              <Link className="link-homepage" to="/">
                Yes
              </Link>
            </button>
            <button className="cancel-sign-out" onClick={signout.close}>
              No
            </button>
            <button className="close-sign-out-modal" onClick={signout.close}>
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
          {/* Water Paramert Monitoring Section */}
          <WaterParameters sensorReadings={readings} />
          {/* Feeding Management Section */}
          <FeedingManagement
            sensorReadings={readings}
            feedingSched={schedArr}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
