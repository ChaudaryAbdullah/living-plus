import React from "react";
import { Home, MessageSquare, BookOpen, User, LogOut } from "lucide-react"; // ✅ Import icons
import "./css/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <div className="nav-item">
          <Home size={24} />
          <span>Discover</span>
        </div>
        <div className="nav-item">
          <MessageSquare size={24} />
          <span>Messages</span>
        </div>
        <div className="nav-item active">
          <BookOpen size={24} />
          <span>Add Rooms</span>
        </div>
        <div className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </div>
        <div className="nav-item logout">
          <LogOut size={24} />
          <span>Logout</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
