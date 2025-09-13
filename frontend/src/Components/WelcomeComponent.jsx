import React from "react";
import "../Styling/Welcome.css";

import libraryBg from "../Images/bg2.png";
import { useNavigate } from "react-router-dom";

export function WelcomeComponent(){
  const navigate=useNavigate()
  function handleclick(){
    navigate(`/login`)
  }
  return (
    <section 
      className="Welcome" 
      style={{
        backgroundImage: `url(${libraryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div className="overlay welcome-box">
        <div className="Welcome-content">
          <h1 className="Welcome-title">Step Into the World of Endless Stories</h1>
          <p className="Welcome-subtitle">
            Find your next favorite book and let your imagination roam.
          </p>
          <button className="cta-btn" onClick={handleclick}>Browse the Library</button>
        </div>
      </div>
    </section>
  );
};

