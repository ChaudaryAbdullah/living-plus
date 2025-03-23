"use client";

import {
  Home,
  Plus,
  ClipboardList,
  Settings,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import "./css/renter-sidebar.css";

const RenterSidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: "discover", icon: <Home size={24} />, label: "Discover" },
    { id: "apply-hostel", icon: <Home size={24} />, label: "Apply Hostel" },
    { id: "apply-rooms", icon: <Plus size={24} />, label: "Apply Rooms" },
    {
      id: "request-parking",
      icon: <ClipboardList size={24} />,
      label: "Request Parking",
    },
    { id: "add-ratings", icon: <Settings size={24} />, label: "Add Ratings" },
    { id: "messages", icon: <MessageSquare size={24} />, label: "Messages" },
    { id: "logout", icon: <LogOut size={24} />, label: "Logout" },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${
                activeItem === item.id ? "active" : ""
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="sidebar-icon">{item.icon}</div>
              <span className="sidebar-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default RenterSidebar;
