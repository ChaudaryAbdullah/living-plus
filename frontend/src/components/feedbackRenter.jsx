"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./css/feedbackOwner.css"; 
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import "./css/view-ratings.css";

const ViewFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activePage, setActivePage] = useState("View Feedbacks");
  const [activeItem, setActiveItem] = useState("apply-hostel");

  useEffect(() => {
    const fetchUserAndFeedbacks = async () => {
      try {
        setLoading(true);
        console.log("Fetching user profile...");

        const userResponse = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });

        console.log("User profile response:", userResponse.data);
        setUser(userResponse.data);

        if (userResponse.data && userResponse.data.user && userResponse.data.user.id) {
          const userId = userResponse.data.user.id;
          console.log("Fetching rentals for owner ID:", userId);
          await fetchOwnerRentalsAndFeedbacks(userId);
        } else {
          console.error("User data incomplete or ID not found:", userResponse.data);
          setError("User profile incomplete. Please log in again.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(`Failed to load user profile: ${error.message}`);
        setLoading(false);
      }
    };

    const fetchOwnerRentalsAndFeedbacks = async (ownerId) => {
      try {
        // First, fetch all rentals owned by this user
        console.log("Making API call to:", `http://localhost:5556/owns/rentals/${ownerId}`);
        const rentalsResponse = await axios.get(
          `http://localhost:5556/owns/rentals/${ownerId}`,
          {
            withCredentials: true,
            timeout: 10000,
          }
        );
        
        console.log("Owner rentals response:", rentalsResponse.data);
        const rentals = rentalsResponse.data;
        
        if (!rentals || rentals.length === 0) {
          console.log("No rentals found for this owner");
          setFeedbacks([]);
          return;
        }
        
        // Collect all rental IDs
        const rentalIds = rentals.map(rental => rental._id);
        console.log("Rental IDs:", rentalIds);
        
        // Fetch feedbacks for all these rentals
        let allFeedbacks = [];
        for (const rentalId of rentalIds) {
          try {
            const feedbackResponse = await axios.get(
              `http://localhost:5556/feedbacks/rental/${rentalId}`,
              {
                withCredentials: true,
                timeout: 10000,
              }
            );
            console.log(`Feedbacks for rental ${rentalId}:`, feedbackResponse.data);
            allFeedbacks = [...allFeedbacks, ...feedbackResponse.data];
          } catch (err) {
            console.error(`Error fetching feedbacks for rental ${rentalId}:`, err);
            // Continue with other rentals even if one fails
          }
        }
        
        console.log("All feedbacks collected:", allFeedbacks);
        setFeedbacks(allFeedbacks);
      } catch (error) {
        console.error("Error fetching owner rentals:", error);
        const errorMsg = error.response
          ? `Status: ${error.response.status}, Message: ${error.response.data.error || JSON.stringify(error.response.data)}`
          : error.message;
        setError(`Failed to load your rentals: ${errorMsg}`);
      }
    };

    fetchUserAndFeedbacks();
  }, []);

  const handleSort = () => {
    const newDirection = sortDirection === "desc" ? "asc" : "desc";
    setSortDirection(newDirection);

    const sortedFeedbacks = [...feedbacks].sort((a, b) => {
      const ratingA = a.rating;
      const ratingB = b.rating;
      return newDirection === "asc" ? ratingA - ratingB : ratingB - ratingA;
    });

    setFeedbacks(sortedFeedbacks);
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesRating = ratingFilter === "" || feedback.rating.toString().includes(ratingFilter);
    const matchesDescription = feedback.description
      ? feedback.description.toLowerCase().includes(descriptionFilter.toLowerCase())
      : true;
    return matchesRating && matchesDescription;
  });

  if (loading) {
    return <div>Loading feedbacks...</div>;
  }

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <main className="main-body">
          <div className="feedbacks-header">
            <h2>Feedbacks for Your Properties</h2>
            <hr />
          </div>

          {error && (
            <div className="error-message" style={{ color: 'red', padding: '10px', margin: '10px 0' }}>
              {error}
            </div>
          )}

          <div className="filters-container">
            <div className="filter-group">
              <label>Rating</label>
              <input
                type="text"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                placeholder="Filter by rating"
              />
            </div>

            <div className="filter-group description-filter">
              <label>Description</label>
              <input
                type="text"
                value={descriptionFilter}
                onChange={(e) => setDescriptionFilter(e.target.value)}
                placeholder="Filter by description"
              />
            </div>

            <button className="sort-btn" onClick={handleSort}>
              <span className="sort-icon">⇅</span>
              Sort by Rating
            </button>
          </div>

          <div className="feedbacks-list">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((feedback) => (
                <div key={feedback._id || feedback.id} className="feedback-item">
                  <div className="feedback-rating">Rating: {feedback.rating}/5</div>
                  <div className="feedback-description">
                    {feedback.description || "No description provided."}
                  </div>
                  <div className="feedback-rental">Property: {feedback.rentalId?.name || feedback.rentalId}</div>
                  <div className="feedback-tenant">From Tenant: {feedback.tenantId?.name || feedback.tenantId}</div>
                  <div className="feedback-date">Date: {new Date(feedback.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
              <div className="no-feedbacks">
                {error ? "Error loading feedbacks" : "No feedbacks found for your properties."}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewFeedbacksPage;