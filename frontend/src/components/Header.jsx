import React from "react";
import "./css/Header.css";
const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">I-TUS</div>
        <div className="header-title">Register Hostel</div>
      </div>
      <div className="header-right">
        <button className="start-listing-btn">Start Listing</button>
        <div className="user-avatar">AA</div>
      </div>
    </header>
  );
};

export default Header;
