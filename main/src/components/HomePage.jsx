import React, { useState, useEffect } from "react";
import "/src/index.css";
import "/src/Homepage.css";

// Routers
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// Firebase
import { auth, db } from "../firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, set } from "firebase/database"; // Realtime Database

// TODO: forgot password and change email LATER
// TODO: responsive homepage
// TODO: finalize homepage

export const currentMachine = "machine0";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const [showModal, setShowModal] = useState({
    signup: location.pathname === "/signup",
    login: location.pathname === "/login",
    authContainer: location.pathname === "/",
  });

  useEffect(() => {
    setShowModal({
      signup: location.pathname === "/signup",
      login: location.pathname === "/login",
      authContainer: location.pathname === "/",
    });
  }, [location.pathname]);

  // Login state
  const [login, setLogin] = useState({ email: "", password: "" });

  // Signup state
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // // Login
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const { email, password } = login;

  //   if (!email || !password) {
  //     setError("Email and password are required.");
  //     return;
  //   }

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     console.log("Logged in user:", userCredential.user);
  //     setError("");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     console.error("Login error:", err.code, err.message);
  //     if (err.code === "auth/user-not-found")
  //       setError("No account found with this email.");
  //     else if (err.code === "auth/wrong-password")
  //       setError("Incorrect password.");
  //     else setError("Login failed. Please try again.");
  //   }
  // };

  // // Signup
  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   const { firstName, lastName, email, password, confirmPassword } = user;

  //   if (!email || !firstName || !lastName || !password || !confirmPassword) {
  //     setError("All fields are required.");
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match.");
  //     setUser((prev) => ({ ...prev, password: "", confirmPassword: "" }));
  //     return;
  //   }

  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const uid = userCredential.user.uid;

  //     // Update displayName
  //     await updateProfile(userCredential.user, {
  //       displayName: `${firstName} ${lastName}`,
  //     });

  //     // Save user info in Realtime Database (safe fields only)
  //     await set(ref(db, `users/${uid}`), {
  //       machineId: currentMachine,
  //       email,
  //       displayName: `${firstName} ${lastName}`,
  //       createdAt: Date.now(),
  //     });

  //     console.log("User saved to Realtime Database:", uid);

  //     // Clear form and error
  //     setUser({
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       password: "",
  //       confirmPassword: "",
  //     });
  //     setError("");

  //     navigate("/dashboard");
  //   } catch (err) {
  //     console.error("Signup error:", err.code, err.message);
  //     let message = "Something went wrong. Please try again.";

  //     if (err.code === "auth/email-already-in-use")
  //       message = "This email is already registered.";
  //     else if (err.code === "auth/invalid-email")
  //       message = "Invalid email format.";
  //     else if (err.code === "auth/weak-password")
  //       message = "Password should be at least 6 characters.";

  //     setError(message);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // show loader

    const { email, password } = login;
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Logged in user:", userCredential.user);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      if (err.code === "auth/user-not-found")
        setError("No account found with this email.");
      else if (err.code === "auth/wrong-password")
        setError("Incorrect password.");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false); // hide loader
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // show loader
    const { firstName, lastName, email, password, confirmPassword } = user;

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setUser((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });
      await set(ref(db, `users/${uid}`), {
        machineId: currentMachine,
        email,
        displayName: `${firstName} ${lastName}`,
        createdAt: Date.now(),
      });

      console.log("User saved to Realtime Database:", uid);

      setUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setError("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err.code, err.message);
      let message = "Something went wrong. Please try again.";
      if (err.code === "auth/email-already-in-use")
        message = "This email is already registered.";
      else if (err.code === "auth/invalid-email")
        message = "Invalid email format.";
      else if (err.code === "auth/weak-password")
        message = "Password should be at least 6 characters.";
      setError(message);
    } finally {
      setLoading(false); // hide loader
    }
  };

  // Goggle
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user info in Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        displayName: user.displayName,
        createdAt: Date.now(),
      });

      console.log("Logged in with Google:", user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  // Facebook
  const facebookProvider = new FacebookAuthProvider();

  const handleFacebookRegister = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      // Save user info in Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        displayName: user.displayName,
        createdAt: Date.now(),
      });

      console.log("Logged in with Facebook:", user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Facebook login error:", err);
    }
  };

  //forgot password

  // Forgot password
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      alert("Please enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Password reset email sent! Check your inbox.");
      setForgotPasswordModal(false);
      setResetEmail("");
    } catch (err) {
      console.error("Error resetting password:", err.code, err.message);
      if (err.code === "auth/user-not-found") {
        alert("No user found with this email.");
      } else if (err.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else if (err.code === "auth/unauthorized-continue-uri") {
        alert(
          "Unauthorized domain. Add your domain in Firebase Auth settings."
        );
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
    <>
      {/* Loading layout */}
      {loading && (
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

      <div
        className="top-bar"
        style={{ display: showModal.authContainer ? "flex" : "none" }}
      >
        <div className="logo">
          <img src="/src/assets/temp_logo.png" alt="Logo" />
        </div>

        <div className="top-bar-right">
          <h1>Accounts</h1>
          <h1>More</h1>
        </div>
      </div>

      <div className="homepage-layout"></div>
      <div className="homepage">
        <section
          className="auth-container fade-in-1s"
          style={{
            display: showModal.authContainer ? "flex" : "none",
            flexDirection: "column",
            gap: "0px",
          }}
        >
          <h1>
            Robo<a>Tilapia</a>
          </h1>
          <p>A water parameter monitoring app</p>
          <div className="homepage-button-container">
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </div>
        </section>

        <div className="form-section">
          <Outlet
            context={{
              showModal,
              setShowModal,
              login,
              setLogin,
              handleLogin,
              handleSignup,
              user,
              setUser,
              error,
              setError,
              handleFacebookRegister,
              handleGoogleRegister,
              forgotPasswordModal,
              setForgotPasswordModal,
              handleForgotPassword,
              resetEmail,
              setResetEmail,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default HomePage;
