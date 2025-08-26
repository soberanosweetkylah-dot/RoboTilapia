import React, { use, useState } from "react";
import "/src/index.css";
import "/src/Homepage.css";
import { Link } from "react-router-dom";
import "../index.css";
import { get, getDatabase } from "firebase/database";
import { auth } from "../firebase.js"; //New users

import logo from "../assets/mini_logo.png";

// TODO Function to add user to firebase once sign up
// TODO Function to open dashboard with loading
// TODO function to authenticate log in

function HomePage() {
  const [showModal, setShowModal] = useState({
    signup: false,
    appName: true,
  });

  // Log in
  const [login, setLogin] = useState({ username: "", code: 0 });
  const handleLogin = () => {};

  return (
    <>
      <div className="homepage-layout"></div>
      <div className="homepage ">
        {/* <img src="assets/temp_logo.png" /> */}
        <section
          className="app-name fade-in-1s"
          style={{
            display: showModal.appName ? "flex" : "none",
            flexDirection: "column",
            gap: "0px",
          }}
        >
          <h1>
            Robo<a>Tilapia</a>
          </h1>
          <p>A water parameter monitoring app</p>
          {/* Login and sign up form */}
        </section>
        <div className="form-section">
          {/* Login */}
          <form
            className="login-form fade-in"
            style={{ display: showModal.signup ? "none" : "inline-flex" }}
          >
            <input
              id="username"
              value={login.username || ""}
              onChange={(e) =>
                setLogin((recent) => ({
                  ...recent,
                  username: e.target.value,
                }))
              }
              type="text"
              placeholder="username"
            />
            <input
              id="code"
              type="number"
              placeholder="code"
              value={login.code || ""}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value) && value.length <= 4) {
                  setLogin((recent) => ({ ...recent, code: e.target.value }));
                }
              }}
            />
            <Link to="/dashboard">
              <input id="login-btn" type="submit" />
            </Link>
            <h1
              className="signup-link"
              onClick={() =>
                setShowModal((r) => ({ ...r, signup: true, appName: false }))
              }
            >
              Don't have an account yet?
            </h1>
          </form>
          {/* Sign up */}
          <form
            className="signup-form fade-in"
            style={{
              display: showModal.signup ? "flex" : "none",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h1>Sign <a>up</a></h1>
            <input
              type="text"
              id="signup-username"
              placeholder="Username"
              required
            />
            <input
              type="email"
              id="signup-email"
              placeholder="Email"
              required
            />
            <input
              type="tel"
              id="signup-phone"
              placeholder="Phone Number"
              required
            />
            <input
              type="password"
              id="signup-password"
              placeholder="Password"
              required
            />
            <input
              type="password"
              id="signup-confirm-password"
              placeholder="Confirm Password"
              required
            />

            <button type="submit" id="signup-btn">
              Sign Up
            </button>

            <p
              className="login-link"
              style={{
                marginTop: "2%",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#f9f8f7",
              }}
              onClick={() =>
                setShowModal((r) => ({ ...r, signup: false, appName: true }))
              }
            >
              Already have an account? Login here
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default HomePage;
