import React from "react";
import "./css/Header.css";
const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <h1 className="logo">LivingPlus</h1>
      </div>
      <div className="header-actions">
        <button className="start-listing-btn">Start Listing</button>
        <button className="font-size-btn">AA</button>
      </div>
    </header>
  );
};

export default Header;
