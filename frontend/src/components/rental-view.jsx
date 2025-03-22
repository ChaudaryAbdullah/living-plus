import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/rental-view.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const RentalView = () => {
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      <Header />

      <div className="main-container">
        <div className="main-content">
          <Sidebar />
          {/* Search Section */}
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">⌕</button>
            </div>
            <button className="filter-btn">≡ Filter</button>
          </div>

          {/* Property Listings */}
          <main className="property-container">
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
                      <a href="/addRooms" className="view-property-btn">
                        View Property
                      </a>
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
      <Footer />
    </div>
  );
};

export default RentalView;
