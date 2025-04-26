"use client";
import { ToastContainer, toast } from "react-toastify";
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
        const response = await axios.get("http://localhost:5556/profile", {
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
          `http://localhost:5556/rents/${tenantId}`,
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
        `http://localhost:5556/parkingSlot/available/${rentalId}`,
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
    console.log(value);
    // Fetch parking slots when a rental is selected
    if (name === "rentalId" && value) {
      setParkingSlots([]); // Reset parking slots before fetching new ones
      fetchParkingSlots(value);
    }
  };

  const getOwnerIdByRentalId = async (rentalId) => {
    try {
      const res = await axios.get(`http://localhost:5556/owns/${rentalId}`, {
        withCredentials: true,
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
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.rentalId);
    if (!formData.rentalId || !formData.parkingSlot) {
      toast.error("Please select both a rental and a parking slot!", {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      setLoading(true);
      console.log(formData);
      const response = await axios.post(
        "http://localhost:5556/parkingRequest",
        {
          slotId: formData.parkingSlot,
          tenantId: user.user.tenantId,
        },
        { withCredentials: true }
      );
      const ownerId = await getOwnerIdByRentalId(formData.rentalId);
      console.log("OwnerId", ownerId);
      const notificationData = {
        tenantId: ownerId,
        date: new Date().toISOString(),
        description: `New Parking Application.`,
      };
      console.log("Notification data:", notificationData);
      await axios.post(
        `http://localhost:5556/notifications`,
        notificationData,
        {
          withCredentials: true,
        }
      );
      console.log("Parking application submitted:", response.data);
      toast.success("Parking slot applied successfully!", {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });

      // Reset form after successful submission
      setFormData({
        rentalId: "",
        parkingSlot: "",
      });
      setParkingSlots([]); // Clear parking slots when form resets
    } catch (error) {
      console.error("Error submitting parking application:", error);
      toast.error("Failed to apply for parking!", {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
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
                    <label style={{ textAlign: "left" }} htmlFor="rentalSelect">
                      Choose Rental
                    </label>
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
                          <option
                            key={rental.rentalId._id}
                            value={rental.rentalId._id}
                          >
                            {rental.rentalId.rentalName || "Unnamed Rental"}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Parking Slot Selection */}
                  <div className="form-group">
                    <label style={{ textAlign: "left" }} htmlFor="parkingSlot">
                      Select Parking Slot
                    </label>
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
      <ToastContainer />
    </div>
  );
};

export default ApplyParking;
