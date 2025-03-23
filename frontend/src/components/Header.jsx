import React from "react";
import "./css/Header.css";
const Header = ({ title }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">Living+</div>
        <div className="header-title">{title}</div>
      </div>
      <div className="header-right">
        <button className="start-listing-btn">Start Listing</button>
        <div className="user-avatar">AA</div>
      </div>
    </header>
  );
};

export default Header;
