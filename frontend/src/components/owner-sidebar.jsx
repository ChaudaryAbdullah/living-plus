"use client"

import { useState } from "react"
import { Home, Plus, ClipboardList, Bookmark, Settings, Mail, LogOut } from "lucide-react"
import "./css/owner-sidebar.css"

const OwnerSidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: "discover", icon: <Home size={24} />, label: "Discover" },
    { id: "register-hostel", icon: <Home size={24} />, label: "Register Hostel" },
    { id: "add-rooms", icon: <Plus size={24} />, label: "Add Rooms" },
    { id: "allocate-parking", icon: <ClipboardList size={24} />, label: "Allocate Parking" },
    { id: "approve-applicants", icon: <Bookmark size={24} />, label: "Approve Applicants" },
    { id: "view-ratings", icon: <Settings size={24} />, label: "View Ratings" },
    { id: "messages", icon: <Mail size={24} />, label: "Messages" },
    { id: "logout", icon: <LogOut size={24} />, label: "Logout" },
  ]

  const handleItemClick = (id) => {
    setActiveItem(id)
  }

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="sidebar-icon">{item.icon}</div>
              <span className="sidebar-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default OwnerSidebar
