import React, { useState, useEffect } from "react";
import axios from "axios";
import "./rental-view.css";

const RentalView = () => {
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch rentals from DB
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get("http://localhost:5555/rentals");
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  return (
    <div className="rental-app">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">I-TUS</h1>
          <h2 className="header-title">Discover Properties</h2>
        </div>
        <button className="start-listing-btn">Start Listing</button>
        <div className="user-avatar">AA</div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <div className="nav-item active">
              <div className="nav-icon house-icon"></div>
              <span>Discover</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon message-icon"></div>
              <span>Messages</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon bookmark-icon"></div>
              <span>Saved Listings</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon profile-icon"></div>
              <span>Profile</span>
            </div>
            <div className="nav-item logout">
              <div className="nav-icon logout-icon"></div>
              <span>Logout</span>
            </div>
          </nav>
        </aside>

        {/* Property Listings */}
        <main className="property-container">
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">
                <span className="search-icon">⌕</span>
              </button>
            </div>
            <button className="filter-btn">
              <span className="filter-icon">≡</span>
              Filter
            </button>
          </div>

          {/* Property Grid */}
          <div className="property-grid">
            {rentals.length > 0 ? (
              rentals.map((rental) => (
                <div className="property-card" key={rental._id}>
                  <div className="property-image">
                    <img
                      src={rental.image || "/placeholder.svg"}
                      alt={rental.rentalName}
                    />
                  </div>
                  <div className="property-details">
                    <h3 className="property-title">{rental.rentalName}</h3>
                    <p className="property-address">{rental.address}</p>
                    <div className="property-specs">
                      <span className="property-units">
                        {rental.totalRooms} Total Rooms
                      </span>
                      <span className="property-beds">
                        {rental.availableRooms} Available
                      </span>
                    </div>
                    <div className="property-footer">
                      <span className="property-price">
                        Facilities: {rental.facilities.join(", ")}
                      </span>
                    </div>
                    <button className="view-property-btn">View Property</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No properties found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RentalView;
