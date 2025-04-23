"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./css/apply-rental.css";
import "./css/view-ratings.css";
import Footer from "./Footer";
import Sidebar from "./renter-sidebar";
import Header from "./Header";

const ApplyRental = () => {
  const [activeItem, setActiveItem] = useState("apply-hostel");
  const [activePage, setActivePage] = useState("Apply Rental");

  // State for user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for form data
  const [formData, setFormData] = useState({
    rentalId: "",
    roomId: "",
    applicantId: "", // Include userId
  });

  // State for rentals and rooms fetched from backend
  const [rentals, setRentals] = useState([]);
  const [properties, setProperties] = useState([]);

  // Fetch user profile to get user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });

        setUser(response.data);
        setLoading(false);

        if (response.data?.user?._id) {
          setFormData((prevData) => ({
            ...prevData,
            userId: response.data.user._id,
          })); // Set userId in formData
        }

        if (response.data?.user?.ownerId) {
          fetchRentalsForUser(response.data.user.ownerId);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch rentals that the user does not own
  const fetchRentalsForUser = async (ownerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5556/owns/norentals/${ownerId}`,
        { withCredentials: true }
      );

      setRentals(response.data);
      console.log("Filtered Rentals:", response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };
  const getOwnerIdByRentalId = async (rentalId) => {
    try {
      const res = await axios.get(`http://localhost:5556/owns/${rentalId}`, {
        withCredentials: true
      });
  
      const rentalArray = res.data;
  
      if (!Array.isArray(rentalArray) || rentalArray.length === 0) {
        console.warn("No rental data found");
        return null;
      }
  
      const rental = rentalArray[0];
      const ownerId = rental._id; // Assuming this is the owner's ID
  
      return ownerId;
    } catch (error) {
      console.error("Failed to fetch owner by rentalId:", error);
      return null;
    }
  };
  
  
  // Fetch rooms based on selected rental
  const fetchRoomsForRental = async (rentalId) => {
    try {
      if (!rentalId) {
        setProperties([]); // Clear rooms if no rental is selected
        return;
      }

      const response = await axios.get("http://localhost:5556/rooms");

      const filteredRooms = response.data.filter(
        (room) => room.rentalId.toString() === rentalId
      );

      console.log("Rooms for selected rental:", filteredRooms);
      setProperties(filteredRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch rooms when a rental is selected
    if (name === "rentalId") {
      fetchRoomsForRental(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user?.user?.id) {
        alert("User not found. Please log in.");
        return;
      }

      console.log("User ID:", user.user.id);

      // Correct payload structure
      const payload = {
        rentalId: formData.rentalId,
        applicantId: user.user.id, // Ensure correct key name
        roomId: formData.roomId,
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        "http://localhost:5556/applyRental",
        payload
      );
      console.log("Response:", payload.rentalId);
      const ownerId = await getOwnerIdByRentalId(payload.rentalId);
      console.log("OwnerId", ownerId)
      const notificationData = {
              tenantId: ownerId,
              date: new Date().toISOString(),
              description: `New Applicant has applied.`
            };
      console.log("Notification data:", notificationData);  
      await axios.post(`http://localhost:5556/notifications`, notificationData, {
        withCredentials: true
      });

      console.log("Application submitted:", response.data);
      alert("Rental application submitted successfully!");
    } catch (error) {
      console.error(
        "Error submitting application:",
        error.response?.data || error.message
      );
      alert("Failed to submit application.");
    }
  };

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="main-body">
          <h2>Choose Rental</h2>
          <div className="form-divider"></div>
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="rentalSelect">Choose Rental</label>
                <select
                  id="rentalSelect"
                  name="rentalId"
                  value={formData.rentalId}
                  onChange={handleChange}
                  className="form-control"
                  disabled={rentals.length === 0}
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
                <label htmlFor="roomSelect">Choose Room</label>
                <select
                  id="roomSelect"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  className="form-control"
                  disabled={properties.length === 0}
                >
                  <option value="">Select a room</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property._id} - {property.rtype}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="apply-btn">
                Apply
              </button>
            </form>
          </div>
          {properties.length > 0 && (
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplyRental;
