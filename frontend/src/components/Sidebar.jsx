import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Home,
  MessageCircle,
  ShieldCheck,
  Handshake,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import "./css/sidebar.css";

const Sidebar = ({ onLogout, activeItem, setActiveItem, setUser }) => {
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      // Execute logout fetch operation
      await fetch("http://localhost:5556/profile/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear local storage
      localStorage.clear();

      // Clear user state if setUser is available
      if (typeof setUser === "function") {
        setUser(null);
      }

      // Call onLogout function if provided
      if (typeof onLogout === "function") {
        onLogout();
      }

      // Redirect to login page
      window.location.href = "http://localhost:5556/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Update last activity timestamp on user interactions
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Set up activity tracking
  useEffect(() => {
    // Events to track user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add event listeners for user activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Check for inactivity periodically
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;

      // If inactive for 30 minutes, log out
      if (timeSinceLastActivity >= inactivityTimeout) {
        console.log("User inactive for 30 minutes. Logging out...");
        handleLogout();
      }
    }, 60000); // Check every minute

    // Clean up event listeners and interval
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(intervalId);
    };
  }, [lastActivity]);

  const menuItems = [
    {
      id: "discover",
      path: "/rental-view",
      icon: <Home size={24} />,
      label: "Discover",
    },
    {
      id: "dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={24} />, // Dashboard icon
      label: "Dashboard",
    },
    {
      id: "messages",
      path: "/chats",
      icon: <MessageCircle size={24} />,
      label: "Messages",
    },
    {
      id: "owned-rentals",
      path: "/owned-rentals",
      icon: <ShieldCheck size={24} />,
      label: "Owned Rental",
    },
    {
      id: "rented-rental",
      path: "/rented-rentals",
      icon: <Handshake size={24} />,
      label: "Rented Rental",
    },
    {
      id: "LogOut",
      path: "/",
      icon: <LogOut size={24} />,
      label: "Logout",
    },
  ];

  const handleItemClick = async (id, path) => {
    if (id === "LogOut") {
      try {
        // Execute logout fetch operation
        await fetch("http://localhost:5556/profile/logout", {
          method: "POST",
          credentials: "include",
        });

        // Clear local storage
        localStorage.clear();

        // Clear user state if setUser is available
        if (typeof setUser === "function") {
          setUser(null);
        }

        // Call onLogout function if provided
        if (typeof onLogout === "function") {
          onLogout();
        }

        // Redirect to login page
        window.location.href = "http://localhost:5173/login";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    } else {
      // Normal navigation for other menu items
      setActiveItem(id);
      navigate(path);
    }
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
            >
              <a
                href={item.path}
                className="sidebar-link"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="sidebar-icon">{item.icon}</div>
                <span className="sidebar-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
