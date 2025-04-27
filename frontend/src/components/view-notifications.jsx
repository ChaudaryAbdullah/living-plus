"use client";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./css/view-notifications.css";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./css/view-ratings.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activePage, setActivePage] = useState("View Notifications");
  const [activeItem, setActiveItem] = useState("apply-hostel");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        console.log("Fetching user profile...");

        const response = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });

        console.log("User profile response:", response.data);
        setUser(response.data);

        if (response.data && response.data.user) {
          // Try with tenantId first, then fall back to id
          const userIdentifier =
            response.data.user.tenantId || response.data.user.id;

          if (userIdentifier) {
            console.log("Using ID for fetching notifications:", userIdentifier);
            await fetchNotificationsForUser(userIdentifier);
          } else {
            console.error(
              "No valid ID found in the user object",
              response.data.user
            );
            setError("User ID not found. Please log in again.");
          }
        } else {
          console.error("User data is incomplete:", response.data);
          setError("User profile incomplete. Please log in again.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(`Failed to load user profile: ${error.message}`);
        setLoading(false);
      }
    };

    const fetchNotificationsForUser = async (id) => {
      try {
        console.log(
          "Making API call to:",
          `http://localhost:5556/notifications/${id}`
        );

        const response = await axios.get(
          `http://localhost:5556/notifications/${id}`,
          {
            withCredentials: true,
            timeout: 10000,
          }
        );

        console.log("Notifications response:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching user notifications:", error);
        const errorMsg = error.response
          ? `Status: ${error.response.status}, Message: ${
              error.response.data.error || JSON.stringify(error.response.data)
            }`
          : error.message;

        setError(`Failed to load your notifications: ${errorMsg}`);
      }
    };

    fetchUser();
  }, []);

  const handleSort = () => {
    const newDirection = sortDirection === "desc" ? "asc" : "desc";
    setSortDirection(newDirection);

    const sortedNotifications = [...notifications].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return newDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    setNotifications(sortedNotifications);
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesDate = notification.date.includes(dateFilter);
    const matchesDescription = notification.description
      .toLowerCase()
      .includes(descriptionFilter.toLowerCase());
    return matchesDate && matchesDescription;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="notification-main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="main-body">
          <div className="notifications-header">
            <h2>Notifications</h2>
            <hr />
          </div>

          {error && (
            <div
              className="error-message"
              style={{ color: "red", padding: "10px", margin: "10px 0" }}
            >
              {error}
            </div>
          )}

          <div className="filters-container">
            <div className="filter-group">
              <label>Date</label>
              <input
                type="text"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
              />
            </div>

            <div className="filter-group description-filter">
              <label>Description</label>
              <input
                type="text"
                value={descriptionFilter}
                onChange={(e) => setDescriptionFilter(e.target.value)}
                placeholder="Filter by description"
              />
            </div>

            <button className="sort-btn" onClick={handleSort}>
              <span className="sort-icon">⇅</span>
              Sort
            </button>
          </div>

          <div className="notifications-list">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id || notification.id}
                  className="notification-item"
                >
                  <div className="notification-date">{notification.date}</div>
                  <div className="notification-description">
                    {notification.description}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                {error
                  ? "Error loading notifications"
                  : "No notifications found"}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
