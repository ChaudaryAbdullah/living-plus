"use client";

import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import "./css/AddRooms.css";
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import Footer from "./Footer";
import axios from "axios";
import "./css/view-ratings.css";

const AddRooms = () => {
  const [activeItem, setActiveItem] = useState("add-rooms");
  const [activePage, setActivePage] = useState("Add Rooms");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [formData, setFormData] = useState({
    rentalId: "",
    rtype: "",
    description: "",
    price: "",
    status: "available",
    picture: "",
    availableRooms: "",
    totalRooms: "",
  });

  // Fetch rentals from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });

        setUser(response.data);
        setLoading(false);

        if (response.data?.user?.ownerId) {
          fetchRentalsForUser(response.data.user.ownerId);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    // Fetch user rentals
    const fetchRentalsForUser = async (ownerId) => {
      try {
        const response = await axios.get(
          `http://localhost:5556/owns/rentals/${ownerId}`,
          { withCredentials: true }
        );

        setRentals(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching rentals:", error);
        setError("Failed to load your rentals");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      availableRooms: rentals.availableRooms,
      TotalRooms: rentals.totalRooms,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5556/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Room added Successful!", {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
        setFormData({
          rentalId: "",
          rtype: "",
          description: "",
          price: "",
          status: "available",
          picture: "",
          availableRooms: "",
          totalRooms: "",
        });
      } else {
        toast.error("Some fields are missing!", {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="main-body">
          <div className="form-container">
            <h2 className="page-title">Add Room</h2>
            <div className="divider"></div>
            <form className="add-room-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label style={{ textAlign: "left" }} htmlFor="rentalId">
                  Select Rental
                </label>

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
                <label style={{ textAlign: "left" }} htmlFor="rtype">
                  Room Type
                </label>
                <select
                  id="rtype"
                  name="rtype"
                  value={formData.rtype}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select room type</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ textAlign: "left" }} htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label style={{ textAlign: "left" }} htmlFor="price">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Add Room
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default AddRooms;
