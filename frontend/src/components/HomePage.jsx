import React from "react";
import "/src/index.css";
import { Link } from "react-router-dom";
import "../index.css";

function HomePage() {
  return (
    <div>
      <nav>
        <Link to="/dashboard">Link To Dashboard</Link>
      </nav>
      <h1>Welcome to Homepage</h1>
    </div>
  );
}

export default HomePage;
