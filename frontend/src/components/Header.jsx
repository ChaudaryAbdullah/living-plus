import React from "react";
import { Link } from "react-router-dom";
import { MdNotificationsNone } from "react-icons/md"; // Import the icon
import "./css/Header.css";

const Header = ({ title, userName }) => {
  const avatar = localStorage.data;

  const getAvatarInitial = (avatar) => {
    return avatar && avatar.length > 0 ? avatar[0].toUpperCase() : "";
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">Living+</div>
        <div className="header-title">{title}</div>
      </div>
      <div className="header-right">
        <Link to="/view-notifications" className="notification-icon">
          <MdNotificationsNone size={24} />
        </Link>

        <Link to="/register-hostel" className="start-listing-btn">
          Start Listing
        </Link>

        <Link to="/dashboard" className="user-avatar">
          {getAvatarInitial(avatar)}
        </Link>
      </div>
    </header>
  );
};

export default Header;
