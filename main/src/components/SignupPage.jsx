import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "/src/Homepage.css";
import { useOutletContext } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👈 install lucide-react or use another icon lib
import googleLogo from "../assets/google_logo.png";
import facebookLogo from "../assets/facebook_logo.png";
import closeBtn from "../assets/close-btn-light.png";

// 1. Add routers
// 2. Change the UI
// 3. 
export default function SignupPage() {
  const {
    showModal,
    setShowModal,
    handleSignup,
    user,
    setUser,
    error,
    setError,
    handleGoogleRegister,
    handleFacebookRegister,
  } = useOutletContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  }, [showModal]);
  return (
    <>
      <div className="signup-modal">
        <Link to="/">
          {" "}
          <button>
            <img src={closeBtn} />
          </button>
        </Link>

        {/* Sign up */}
        <h1>
          Sign <a>up</a>
        </h1>
        <form
          onSubmit={handleSignup}
          className="signup-form fade-in"
          style={{
            display: showModal.signup ? "flex" : "none",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            type="text"
            id="firstname"
            placeholder="First Name"
            value={user.firstName || ""}
            onChange={(e) =>
              setUser((recent) => ({ ...recent, firstName: e.target.value }))
            }
            required
          />
          <input
            type="text"
            id="lastname"
            placeholder="Last Name"
            value={user.lastName || ""}
            onChange={(e) =>
              setUser((recent) => ({ ...recent, lastName: e.target.value }))
            }
          />
          <input
            type="email"
            id="signup-email"
            placeholder="Email"
            required
            value={user.email || ""}
            onChange={(e) =>
              setUser((recent) => ({ ...recent, email: e.target.value }))
            }
          />
          <div className="signup-password-container">
            {" "}
            {/* Password with toggle */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="signup-password"
                placeholder="Password"
                value={user.password || ""}
                onChange={(e) =>
                  setUser((recent) => ({ ...recent, password: e.target.value }))
                }
                required
                className="w-full p-2 pr-10 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Confirm Password with toggle */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="signup-confirm-password"
                placeholder="Confirm Password"
                required
                value={user.confirmPassword || ""}
                onChange={(e) =>
                  setUser((recent) => ({
                    ...recent,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full p-2 pr-10 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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

          <button type="submit" id="signup-btn">
            Sign Up
          </button>

          <Link className="login-link" to="/login">
            <p
              style={{
                marginTop: "2%",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#f9f8f7",
              }}
            >
              Already have an account? Login here
            </p>
          </Link>
          {/* Log in options */}
          <div className="signup-options">
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
        </form>
      </div>
    </>
  );
}
