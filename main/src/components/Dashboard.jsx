/**
 * TODO:
 *
 *
 * 3. Settings modal
 * - create modal of settings
 * - fill missing functions (more, about, and more)
 *
 * 4. Add SMS alert Firebase
 *
 * 5. responsivenss
 *
 * BUG hard to click yes button
 *
 */

import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
// CSS
import "../Dashboard.css";
import "../Transition.css";
import "../Responsive.css";

// Assets
import ProfilePic from "../assets/profile-pic.png";
import MenuBtn from "../assets/menu.png";
import CloseBtnLight from "../assets/close-btn-light.png";
import CloseBtnDark from "../assets/close-btn-dark.png";
import monitoringIcon from "../assets/monitoring-icons/monitoring-icon.png";
import feedManagementIcon from "../assets/monitoring-icons/feeding-management-icon.png";
import settingsIcon from "../assets/monitoring-icons/settingss.png";
import logoutIcon from "../assets/monitoring-icons/logout.png";
import logo from "../assets/temp_logo.png";

// utilities
import {
  useAnimatedToggle,
  useReadDatabase,
  useCurrentUser,
} from "./utils.jsx";

import { auth } from "../firebase.js";

function Dashboard() {
  // Sensor Readings
  const { readings, loading } = useReadDatabase("/machines/machine0/sensors");
  // const { userData } = useCurrentUser();

  const sidebar = useAnimatedToggle(300);
  const signout = useAnimatedToggle(300);
  const closeSignoutSideBar = () => {
    sidebar.close();
    signout.close();
  };

  const currentUser = auth.currentUser;

  // Closes sign out and sidebar when Escape is pressed
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        if (signout.shouldRender) signout.close();
        else if (sidebar.shouldRender) sidebar.close();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [signout.shouldRender, sidebar.shouldRender]);

  // Routers
  const location = useLocation();
  const navRefs = useRef([]);
  const sections = [
    {
      title: "Monitoring",
      path: "/dashboard/water-parameter-monitoring",
      img: monitoringIcon,
    },
    {
      title: "Feeding Management",
      path: "/dashboard/feeding-management",
      img: feedManagementIcon,
    },
    {
      title: "Menu",
      path: "/dashboard/settings",
      img: settingsIcon, // no {}
    },
    {
      title: "Sign Out",
      path: null,
      img: logoutIcon, // no {}
    },
  ];

  // Active nav index based on current URL
  const activeIndex =
    sections.findIndex((sec) => location.pathname === sec.path) || 0;

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

      {sidebar.shouldRender && (
        <div
          className={`side-bar-navigation ${
            sidebar.animating ? "slide-in" : "slide-out"
          }`}
          onClick={(e) => {
            if (e.target.classList.contains("side-bar-navigation")) {
              sidebar.close();
            }
          }}
        >
          <button className="close-side-bar" onClick={sidebar.close}>
            <img src={CloseBtnLight} alt="close" />
          </button>
          <nav>
            <h1 className="user-profile">Profile</h1>
            <h1 className="settings">Settings</h1>
            <h1 className="help">Help</h1>
            <h1 className="logout" onClick={signout.open}>
              Logout
            </h1>
          </nav>
        </div>
      )}
      {/* MAIN DASHBOARD */}
      <div className="dashboard">
        <div className="top-bar">
          <section className="profile-section">
            <img className="logo" src={logo} alt="logo" title="logo" />

            <div className="profile-description">
              {loading ? (
                <p>Loading user info...</p>
              ) : currentUser ? (
                <>
                  <h3>Welcome, {currentUser.displayName}</h3>
                  <h4>{currentUser.email}</h4>
                </>
              ) : (
                <>
                  <h3>Welcome, Tilapia Farmer 1</h3>
                  <h4>tilapiaFarmer@gmail.com</h4>
                </>
              )}
            </div>
          </section>

          <section className="navigation-bar">
            <div className="nav-items">
              {sections.map((sec, index) =>
                sec.title === "Menu" ? (
                  <h1
                    key={index}
                    onClick={sidebar.open} // 🔹 Menu opens sidebar only
                    className="menu-link"
                  >
                    <img src={sec.img} />
                    {sec.title}
                  </h1>
                ) : sec.title == "Sign Out" ? (
                  <h1
                    key={index}
                    onClick={signout.open} // 🔹 Menu opens sidebar only
                    className="menu-link"
                  >
                    <img src={sec.img} />
                    {sec.title}
                  </h1>
                ) : (
                  <Link
                    key={index}
                    to={sec.path}
                    style={{ textDecoration: "none" }}
                    onClick={closeSignoutSideBar} // 🔹 Close sidebar & signout when navigating
                  >
                    {/* <img src={}/> */}
                    <h1
                      ref={(el) => (navRefs.current[index] = el)}
                      className={activeIndex === index ? "active" : ""}
                    >
                      <img src={sec.img} />
                      {sec.title}
                    </h1>
                  </Link>
                )
              )}

              {/* Active background */}
              <div
                className="active-bg"
                style={{
                  width: navRefs.current[activeIndex]?.offsetWidth + "px",
                  left: navRefs.current[activeIndex]?.offsetLeft + "px",
                }}
              />
            </div>
          </section>
        </div>

        {/* Outlet renders child route */}
        <div className="content-section">
          <Outlet
            context={{
              readings,
              closeSignoutSideBar,
              signout,
              sidebar,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
