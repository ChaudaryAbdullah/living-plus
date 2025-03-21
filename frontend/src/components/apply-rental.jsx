"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./css/apply-rental.css";
import { Home, MessageSquare, Bookmark, User, LogOut } from "lucide-react";

const ApplyRental = () => {
  // State for form data
  const [formData, setFormData] = useState({
    rentalId: "",
    roomType: "single",
  });

  // State for rentals and rooms fetched from backend
  const [rentals, setRentals] = useState([]);
  const [properties, setProperties] = useState([]);

  // Fetch rentals from backend
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axios.get("http://localhost:5555/rentals");
        console.log("Fetched Rentals:", response.data); // Debugging
        setRentals(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };

    fetchRentals();
  }, []);

  // Fetch available rooms from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5555/rooms");
        console.log("Fetched Rooms:", response.data); // Debugging
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5555/applyRental",
        formData
      );
      console.log("Application submitted:", response.data);
      alert("Rental application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="rental-app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">I-TUS</div>
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
            <Bookmark size={24} />
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
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>Apply for Rental</h1>
          </div>
          <div className="header-actions">
            <button className="start-listing-btn">Start Listing</button>
            <div className="avatar">AA</div>
          </div>
        </header>

        {/* Form Section */}
        <div className="form-section">
          <h2>Choose Rental</h2>
          <div className="form-divider"></div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="rentalSelect">Choose Rental</label>
              <select
                id="rentalSelect"
                name="rentalId"
                value={formData.rentalId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select a rental</option>
                {rentals.map((rental) => (
                  <option key={rental._id} value={rental._id}>
                    {rental.rentalName || rental.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="roomType">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="form-control"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
              </select>
            </div>

            <button type="submit" className="apply-btn">
              Apply
            </button>
          </form>

          {/* Available Rooms Section */}
          <div className="properties-section">
            <h3>Available Properties</h3>
            <div className="properties-container">
              {properties.map((property) => {
                // Find rental for this room
                const rental = rentals.find(
                  (r) => r._id.toString() === property.rentalId.toString()
                );

                return (
                  <div key={property._id} className="property-card">
                    <h4>{property.rtype} Room</h4>
                    <p>
                      Rental:{" "}
                      {rental ? rental.rentalName || rental.name : "Unknown"}
                    </p>
                    <p>Status: {property.status}</p>
                    <p>Price: ${property.price}/month</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-left">
            <p>© 2023 I-Tus Rental Management, Nairobi Kenya</p>
          </div>
          <div className="footer-center">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
          <div className="footer-right">
            <a href="#">Support & Resources</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ApplyRental;
