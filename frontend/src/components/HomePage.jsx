import React from "react";
import "/src/index.css";
import "/src/Homepage.css";
import { Link } from "react-router-dom";
import "../index.css";

function HomePage() {
  return (
    <>
      <Link to="/dashboard">
        <h1 style={{ color: "black" }}>Go to Dashbord</h1>
      </Link>

      <div className="image-container">Hello</div>
      <div className="form-container">Hey</div>
    </>
  );
}

export default HomePage;
