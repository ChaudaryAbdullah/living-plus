"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./css/applyParking.css";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ApplyParking = ({ tenantId }) => {
  const [formData, setFormData] = useState({
    rentalId: "",
    parkingSlot: "",
  });

  const [userRentals, setUserRentals] = useState([]); // Rentals where user is a tenant
  const [parkingSlots, setParkingSlots] = useState([]);

  // Fetch rentals where user is a tenant
  useEffect(() => {
    const fetchUserRentals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/rents/${tenantId}`
        );
        setUserRentals(response.data);
      } catch (error) {
        console.error("Error fetching user rentals:", error);
      }
    };
    fetchUserRentals();
  }, [tenantId]);

  // Fetch available parking slots
  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const response = await axios.get("http://localhost:5555/parkinglot");
        setParkingSlots(
          response.data.filter((slot) => slot.status === "available")
        );
      } catch (error) {
        console.error("Error fetching parking slots:", error);
      }
    };
    fetchParkingSlots();
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
        "http://localhost:5555/applyParking",
        formData
      );
      console.log("Parking application submitted:", response.data);
      alert("Parking slot applied successfully!");
    } catch (error) {
      console.error("Error submitting parking application:", error);
      alert("Failed to apply for parking.");
    }
  };

  return (
    <div className="parking-app-container">
      <Header />
      {/* Main Content */}
      <div className="content-container">
        <Sidebar />
        <div className="main-content">
          {/* Form Section */}
          <div className="form-section">
            <h2>Select Parking</h2>
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
                  {userRentals.map((rental) => (
                    <option key={rental._id} value={rental._id}>
                      {rental.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="parkingSlot">Select Parking Slot</label>
                <select
                  id="parkingSlot"
                  name="parkingSlot"
                  value={formData.parkingSlot}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select a slot</option>
                  {parkingSlots.map((slot) => (
                    <option key={slot._id} value={slot._id}>
                      {slot.slotNumber} - {slot.status}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="apply-btn">
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyParking;
