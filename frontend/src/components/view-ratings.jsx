import axios from "axios";
import React, { useState, useEffect } from "react";
import { Star, Filter } from "lucide-react";
import "./css/view-ratings.css";
import OwnerSidebar from "./owner-sidebar";

const ViewRatings = () => {
  const [properties, setProperties] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [activeItem, setActiveItem] = useState("view-ratings");
  const [userRentals, setUserRentals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5555/profile", {
          withCredentials: true,
        });

        setUser(response.data);
        setLoading(false);

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

  const fetchRentalsForUser = async (ownerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5555/owns/rentals/${ownerId}`,
        { withCredentials: true }
      );

      setUserRentals(response.data);
      fetchFeedbackForRentals(response.data);
      setProperties(response.data); // Set properties dynamically
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  const fetchFeedbackForRentals = async (rentals) => {
    try {
      const feedbackData = {};
      for (let rental of rentals) {
        console.log(rental._id);
        const response = await axios.get(
          `http://localhost:5555/feedback/${rental._id}`, // Assuming rental._id is the rental ID
          { withCredentials: true }
        );
        feedbackData[rental._id] = response.data;
      }
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="star filled" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="star half-filled" size={16} />);
      } else {
        stars.push(<Star key={i} className="star" size={16} />);
      }
    }

    return stars;
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <OwnerSidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h1 className="logo">I-TUS</h1>
            <h2 className="page-title">Ratings & Feedback</h2>
          </div>
          <div className="header-right">
            <button className="start-listing-btn">Start Listing</button>
            <div className="user-avatar">AA</div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="filter-bar">
          <button className="filter-btn">
            <Filter size={20} />
            Filter
          </button>
        </div>

        {/* Property Grid */}
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div className="property-card" key={property._id}>
                <h3 className="property-name">{property.name}</h3>
                <p className="property-address">{property.address}</p>
                <p className="property-amenities">{property.amenities}</p>
                <p className="property-capacity">{property.capacity}</p>
                <div className="property-ratings">
                  <p className="ratings-label">Ratings</p>
                  <div className="stars-container">
                    {renderStars(property.rating)}
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="property-feedback">
                  <h4 className="feedback-title">Feedback</h4>
                  {feedback[property._id] &&
                  feedback[property._id].length > 0 ? (
                    feedback[property._id].map((fb, index) => (
                      <div key={index} className="feedback-item">
                        <p className="feedback-user">{fb.user}: </p>
                        <p className="feedback-text">{fb.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-feedback">No feedback available</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-properties">No properties found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRatings;
