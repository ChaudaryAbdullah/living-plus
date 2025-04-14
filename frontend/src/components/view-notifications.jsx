"use client"

import { useState, useEffect } from "react"
import "./css/view-notifications.css"
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import "./css/view-ratings.css";
// Mock database service
const fetchNotifications = async () => {
  // In a real app, this would be an API call to your database
  return [
    { id: 1, date: "2023-04-15", description: "Your rental application has been approved." },
    { id: 2, date: "2023-04-10", description: "New message from property owner." },
    { id: 3, date: "2023-04-05", description: "Rent payment confirmation." },
    { id: 4, date: "2023-03-28", description: "Maintenance request completed." },
    { id: 5, date: "2023-03-20", description: "Upcoming rent payment reminder." },
  ]
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [dateFilter, setDateFilter] = useState("")
  const [descriptionFilter, setDescriptionFilter] = useState("")
  const [sortDirection, setSortDirection] = useState("desc") // 'asc' or 'desc'
  const [activePage, setActivePage] = useState("View Notifications");
  const [activeItem, setActiveItem] = useState("apply-hostel");
  useEffect(() => {
    const getNotifications = async () => {
      const data = await fetchNotifications()
      setNotifications(data)
    }

    getNotifications()
  }, [])

  const handleSort = () => {
    const newDirection = sortDirection === "desc" ? "asc" : "desc"
    setSortDirection(newDirection)

    const sortedNotifications = [...notifications].sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      return newDirection === "asc" ? dateA - dateB : dateB - dateA
    })

    setNotifications(sortedNotifications)
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesDate = notification.date.includes(dateFilter)
    const matchesDescription = notification.description.toLowerCase().includes(descriptionFilter.toLowerCase())
    return matchesDate && matchesDescription
  })

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="main-body">
          <div className="notifications-header">
            <h2>Notifications</h2>
            <hr />
          </div>

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
                <div key={notification.id} className="notification-item">
                  <div className="notification-date">{notification.date}</div>
                  <div className="notification-description">{notification.description}</div>
                </div>
              ))
            ) : (
              <div className="no-notifications">No notifications found</div>
            )}
          </div>
        </main>
      </div>

      <Footer />   
    </div>
  )
}

export default NotificationsPage
