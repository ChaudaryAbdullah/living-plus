import axios from "axios";
import React, { useState, useEffect } from "react";
import { Star, Filter } from "lucide-react";
import "./css/view-ratings.css";

const ViewRatings = () => {
  const [properties, setProperties] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("high-to-low");

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

      setProperties(response.data);
      fetchFeedbackForRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  const fetchFeedbackForRentals = async (rentals) => {
    try {
      const feedbackData = {};
      for (let rental of rentals) {
        const response = await axios.get(
          `http://localhost:5555/feedback/${rental._id}`,
          { withCredentials: true }
        );
        feedbackData[rental._id] = response.data;
      }
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const calculateAverageRating = (rentalId) => {
    if (!feedback[rentalId] || feedback[rentalId].length === 0) return 0;

    const totalRating = feedback[rentalId].reduce(
      (sum, fb) => sum + (fb.rating || 0),
      0
    );
    return totalRating / feedback[rentalId].length;
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

  const sortedProperties = [...properties].sort((a, b) => {
    const ratingA = calculateAverageRating(a._id);
    const ratingB = calculateAverageRating(b._id);
    return sortOrder === "high-to-low" ? ratingB - ratingA : ratingA - ratingB;
  });

  return (
    <div className="app-container">
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h1 className="logo">I-TUS</h1>
            <h2 className="page-title">Ratings & Feedback</h2>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="filter-bar">
          <button
            className="filter-btn"
            onClick={() =>
              setSortOrder(
                sortOrder === "high-to-low" ? "low-to-high" : "high-to-low"
              )
            }
          >
            <Filter size={20} /> Sort{" "}
            {sortOrder === "high-to-low" ? "(High to Low)" : "(Low to High)"}
          </button>
        </div>

        {/* Property Grid */}
        <div className="property-grid">
          {sortedProperties.length > 0 ? (
            sortedProperties.map((property) => {
              const avgRating = calculateAverageRating(property._id);

              return (
                <div className="property-card" key={property._id}>
                  <h3 className="property-name">{property.name}</h3>
                  <p className="property-address">{property.address}</p>
                  <p className="property-amenities">{property.amenities}</p>
                  <p className="property-capacity">
                    Capacity: {property.capacity}
                  </p>

                  <div className="property-ratings">
                    <p className="ratings-label">Ratings</p>
                    <div className="stars-container">
                      {renderStars(avgRating)}
                    </div>
                    <p className="average-rating">{avgRating.toFixed(1)} / 5</p>
                  </div>

                  <div className="property-feedback">
                    <h4 className="feedback-title">Feedback</h4>
                    {feedback[property._id] &&
                    feedback[property._id].length > 0 ? (
                      feedback[property._id].map((fb, index) => (
                        <div key={index} className="feedback-item">
                          <p className="feedback-text">{fb.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="no-feedback">No feedback available</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-properties">No properties found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRatings;
