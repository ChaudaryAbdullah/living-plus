import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/view-ratings.css";
import "./css/rental-view.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const RentalView = () => {
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeItem, setActiveItem] = useState("discover");
  const [activePage, setActivePage] = useState("Discover");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get("http://localhost:5556/rentals");
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };
    fetchRentals();
  }, []);

  // Filter rentals based on search term
  const filteredRentals = rentals.filter((rental) =>
    rental.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

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
        </div>

        {/* Property Listings */}
        <div className="main-body">
          <div className="property-grid">
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental) => (
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
                      <p className="property-units">
                        Total Rooms: {rental.totalRooms}
                      </p>
                      <p className="property-beds">
                        Available: {rental.availableRooms}
                      </p>
                    </div>
                    <div className="property-footer">
                      <span className="property-price">
                        Facilities: {rental.facilities.join(", ")}
                      </span>
                    </div>
                    <Link
                      to={`/rental/${rental._id}`}
                      className="view-property-btn"
                    >
                      View Property
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No properties found.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RentalView;
