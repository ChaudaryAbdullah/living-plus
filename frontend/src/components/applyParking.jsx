"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./css/applyParking.css";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./renter-sidebar";
import "./css/view-ratings.css";

const ApplyParking = () => {
  const [formData, setFormData] = useState({
    rentalId: "",
    parkingSlot: "",
  });

  const [parkingSlots, setParkingSlots] = useState([]);
  const [userRentals, setUserRentals] = useState([]); // Rentals where user is a tenant
  const [user, setUser] = useState(null); // Initially null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userObjectDump, setUserObjectDump] = useState(""); // To help debug the structure
  const [activeItem, setActiveItem] = useState("request-parking");
  const [activePage, setActivePage] = useState("Apply Parking");
  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5555/profile", {
          withCredentials: true,
        });
        console.log("Fetched user profile:", response.data);

        // Store the full user object for debugging
        setUserObjectDump(JSON.stringify(response.data, null, 2));

        setUser(response.data);
        setLoading(false);

        // Immediately fetch rentals for user
        if (response.data) {
          fetchRentalsForUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    // Fetch rentals based on user data
    const fetchRentalsForUser = async (userData) => {
      try {
        let tenantId = userData.tenantId;

        const response = await axios.get(
          `http://localhost:5555/rents/${tenantId}`,
          { withCredentials: true }
        );
        console.log("Fetched rentals for user:", response.data);
        setUserRentals(response.data);
      } catch (error) {
        console.error("Error fetching user rentals:", error);
        setError("Failed to load your rentals");
      }
    };

    fetchUser();
  }, []); // Run only once on component mount

  // Function to fetch parking slots for the selected rental
  const fetchParkingSlots = async (rentalId) => {
    try {
      const response = await axios.get(
        `http://localhost:5555/parkingSlot/available/${rentalId}`,
        { withCredentials: true }
      );
      setParkingSlots(response.data);

      console.log("Fetched available parking slots:", response.data);
    } catch (error) {
      console.error("Error fetching parking slots:", error);
      setError("Failed to load available parking slots");
    }
  };

  // Handle input changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch parking slots when a rental is selected
    if (name === "rentalId" && value) {
      setParkingSlots([]); // Reset parking slots before fetching new ones
      await fetchParkingSlots(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rentalId || !formData.parkingSlot) {
      alert("Please select both a rental and a parking slot.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5555/parkingRequest",
        formData,
        { withCredentials: true }
      );
      console.log("Parking application submitted:", response.data);
      alert("Parking slot applied successfully!");

      // Reset form after successful submission
      setFormData({
        rentalId: "",
        parkingSlot: "",
      });
      setParkingSlots([]); // Clear parking slots when form resets
    } catch (error) {
      console.error("Error submitting parking application:", error);
      alert("Failed to apply for parking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        <div className="main-body">
          <div className="Parking-content">
            <div className="form-section">
              <h2>Select Parking</h2>

              {loading && !userRentals.length ? (
                <p>Loading data...</p>
              ) : (
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
                      disabled={userRentals.length === 0}
                    >
                      <option value="">Select a rental</option>
                      {userRentals.length === 0 ? (
                        <option disabled>No rentals available</option>
                      ) : (
                        userRentals.map((rental) => (
                          <option key={rental._id} value={rental._id}>
                            {rental.rentalName || "Unnamed Rental"}
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
                      disabled={parkingSlots.length === 0}
                    >
                      <option value="">Select a slot</option>
                      {parkingSlots.length === 0 ? (
                        <option disabled>No available slots</option>
                      ) : (
                        parkingSlots.map((slot, index) => (
                          <option key={slot._id || index} value={slot._id}>
                            Slot ID: {slot._id} -{" "}
                            {slot.is_occupied ? "Occupied" : "Available"}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="apply-btn"
                    disabled={!user || userRentals.length === 0}
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplyParking;
