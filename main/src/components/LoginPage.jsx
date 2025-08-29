import React, { useEffect, useState } from "react";
import "/src/Homepage.css";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import googleLogo from "../assets/google_logo.png";
import facebookLogo from "../assets/facebook_logo.png";
import closeBtn from "../assets/close-btn-light.png";

export default function LoginPage() {
  const {
    showModal,
    setShowModal,
    login,
    setLogin,
    handleLogin,
    handleGoogleRegister,
    handleFacebookRegister,
    forgotPasswordModal,
    setForgotPasswordModal,
    handleForgotPassword,
    resetEmail,
    setResetEmail,
    error,
    setError,
  } = useOutletContext();

  useEffect(() => {
    setLogin({ email: "", password: "" });
  }, [showModal]);

  return (
    <>
      {forgotPasswordModal && (
        <div className="forgot-password-modal">
          <form
            onSubmit={handleForgotPassword}
            className="forgot-password-form"
          >
            <button type="button" onClick={() => setForgotPasswordModal(false)}>
              ✕
            </button>
            <h1>Reset Password</h1>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" id="reset-btn">
              Send Reset Email
            </button>
          </form>
        </div>
      )}
      <form
        className="login-modal fade-in"
        style={{ display: showModal.signup ? "none" : "inline-flex" }}
        onSubmit={handleLogin}
      >
        <Link to="/">
          {" "}
          <button>
            <img src={closeBtn} />
          </button>
        </Link>
        <h1>Log In</h1>
        <input
          id="login-email"
          value={login.email || ""}
          onChange={(e) =>
            setLogin((recent) => ({
              ...recent,
              email: e.target.value,
            }))
          }
          type="text"
          placeholder="email"
          reqyuired
        />
        <div className="login-password-container">
          <input
            id="login-password"
            type="text"
            placeholder="password"
            value={login.password || ""}
            onChange={(e) =>
              setLogin((recent) => ({
                ...recent,
                password: e.target.value,
              }))
            }
            required
          />
          <p onClick={() => setForgotPasswordModal(true)}>Forgot Password?</p>
        </div>
        <div className="error-container">
          {error && (
            <p
              style={{
                color: "rgba(250, 87, 87, 0.97)",
                fontSize: "0.9rem",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </div>

        <input id="login-btn" type="submit" />

        <div className="main-options">
          {" "}
          <Link className="signup-link" to="/signup">
            <p>Don't have an account yet?</p>
          </Link>
          {/* Log in options */}
          <div className="login-options">
            <p>Or log in with:</p>
            <div className="logo-container">
              <img
                onClick={handleGoogleRegister}
                className="google-option"
                src={googleLogo}
              />
              <img
                onClick={handleFacebookRegister}
                className="facebook-option"
                src={facebookLogo}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
