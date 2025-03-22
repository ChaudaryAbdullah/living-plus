"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./css/applyParking.css";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

// 🔴 Hardcoded Tenant ID (Replace this with the actual ObjectId from MongoDB)
const HARDCODED_TENANT_ID = "67dd06809a81ff778eb16d00";

const ApplyParking = () => {
  const [formData, setFormData] = useState({
    rentalId: "",
    parkingSlot: "",
  });

  const [userRentals, setUserRentals] = useState([]); // Rentals where user is a tenant
  const [parkingSlots, setParkingSlots] = useState([]);

  // Fetch rentals where the hardcoded user is a tenant
  useEffect(() => {
    const fetchUserRentals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/rents/${HARDCODED_TENANT_ID}`
        );
        console.log("Fetched rentals for hardcoded tenant:", response.data);
        setUserRentals(response.data);
      } catch (error) {
        console.error("Error fetching user rentals:", error);
      }
    };

    fetchUserRentals();
  }, []);

  // Fetch available parking slots
  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const response = await axios.get("http://localhost:5555/parkingslot");
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
        "http://localhost:5555/parkingRequest",
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
      <div className="content-container">
        <Sidebar />
        <div className="main-content">
          <div className="form-section">
            <h2>Select Parking</h2>
            <form onSubmit={handleSubmit}>
              {/* Rental Selection */}
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
                  {userRentals.length === 0 ? (
                    <option disabled>No rentals available</option>
                  ) : (
                    userRentals.map((rental) => (
                      <option key={rental._id} value={rental._id}>
                        {rental.name || "Unnamed Rental"}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Parking Slot Selection */}
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
                  {parkingSlots.length === 0 ? (
                    <option disabled>No available slots</option>
                  ) : (
                    parkingSlots.map((slot) => (
                      <option key={slot._id} value={slot._id}>
                        {slot.slotNumber} - {slot.status}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button type="submit" className="apply-btn">
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplyParking;
