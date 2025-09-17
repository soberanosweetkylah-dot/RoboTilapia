// BUG fixed height for responsive desktop

import React, { useState, useEffect } from "react";
import "/src/index.css";

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

      {/* Top bar (shown only if modal is active) */}
      <div
        className={`w-full h-[60px] mt-5 flex justify-between items-center px-5 fixed top-0 left-0 bg-transparent z-[1000] ${
          showModal.authContainer ? "flex" : "hidden"
        }`}
      >
        <div className="flex items-center gap-[10px]">
          <img
            src="/src/assets/temp_logo.png"
            className="h-[5rem] md:h-[7vw] lg:h-[8rem]"
            alt="Logo"
          />
        </div>

        <div className="w-1/2 flex items-center justify-end gap-[15px] text-[clamp(15px,1.5vw,30px)] text-white  ">
          <h1>Accounts</h1>
          <h1>More</h1>
        </div>
      </div>

      {/* Main page */}
      <div className="m-0  min-h-[clamp(650px,100vh,100vh)] w-screen box-border  flex flex-col justify-center items-center bg-gradient-to-b from-[#001018] via-[#002033] to-[#0a436f]">
        <section
          className={`text-[#f9f8f7] flex flex-col items-center justify-end gap-0 ${
            showModal.authContainer ? "flex animate-fade-in" : "hidden"
          }`}
        >
          <h1 className="text-[2.5rem] md:text-[6vw] lg:text-[3.2rem] font-extrabold drop-shadow-md">
            Robo<span className="text-gray-500">Tilapia</span>
          </h1>
          <p className="text-1xl md:text-2xl lg:text-1xl mb-[10%]">
            A water parameter monitoring app
          </p>
          <div className="flex justify-center items-center mt-[5%] gap-4">
            <Link to="/login">
              <button className="w-[clamp(6rem,20vw,10rem)] h-[clamp(2.5rem,6vh, 4.5rem)] text-[clamp(14px,2vw,25px)] px-6 py-2 bg-blue-600  shadow hover:bg-blue-700  font-bold border-none rounded-[12px] bg-gradient-to-br from-sky-300 to-cyan-400 text-[#0b2132] cursor-pointer transition-all duration-300 ease-in-out relative">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="w-[clamp(6rem,20vw,10rem)] h-[clamp(2.5rem,6vh, 4.5rem)] text-[clamp(14px,2vw,25px)] px-6 py-2 bg-gray-200  shadow hover:bg-gray-300  font-bold border-none rounded-[12px] bg-gradient-to-br from-sky-300 to-cyan-400 text-[#0b2132] cursor-pointer transition-all duration-300 ease-in-out relative">
                Signup
              </button>
            </Link>
          </div>
        </section>

        <section className="form-section w-full">
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
        </section>
      </div>
    </>
  );
}

export default HomePage;
