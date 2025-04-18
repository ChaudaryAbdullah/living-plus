// In your FeedbackRenter component (frontend):

"use client";

import React, { useState, useEffect } from 'react';
import './css/feedbackRenter.css';
import "./css/view-ratings.css";
import Header from "./Header";
import Sidebar from "./renter-sidebar";
import Footer from "./Footer";
import axios from 'axios'; // Import axios

const FeedbackRenter = () => {
  const [formData, setFormData] = useState({
    rating: '',
    description: ''
  });
  const [activeItem, setActiveItem] = useState("feedback");
  const [activePage, setActivePage] = useState("Feedback");
  const [submissionStatus, setSubmissionStatus] = useState(null); // To show success/error messages
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [rentalId, setRentalId] = useState(null);
  const [loadingRental, setLoadingRental] = useState(true);
  const [errorRental, setErrorRental] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        console.log("Fetching user profile...");
        const response = await axios.get("http://localhost:5555/profile", {
          withCredentials: true,
        });
        console.log("User profile response:", response.data);
        setUser(response.data);
        setLoadingUser(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorUser(`Failed to load user profile: ${error.message}`);
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRentalId = async () => {
      if (user?.user?.tenantId) {
        try {
          setLoadingRental(true);
          console.log("Fetching rental ID for tenant:", user.user.tenantId);
          const response = await axios.get(`http://localhost:5555/rents/${user.user.tenantId}`, {
            withCredentials: true,
          });
          console.log("Fetched user rents:", response.data);
          if (response.data && response.data.length > 0 && response.data[0]?.rentalId?._id) {
            setRentalId(response.data[0].rentalId._id);
          } else {
            setErrorRental("No active rental found for this tenant.");
          }
          setLoadingRental(false);
        } catch (error) {
          console.error("Error fetching user rents:", error);
          setErrorRental(`Failed to load rental information: ${error.message}`);
          setLoadingRental(false);
        }
      } else if (user === null && !loadingUser && !errorUser) {
        setErrorRental("User information not available.");
        setLoadingRental(false);
      } else {
        setLoadingRental(false);
      }
    };

    fetchRentalId();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rating' && value !== '' && !/^[1-5]*$/.test(value)) {
      return;
    }
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting'); // Indicate submission in progress

    if (!rentalId) {
      setSubmissionStatus('error');
      // Keep the existing error message in errorRental
      setTimeout(() => setSubmissionStatus(null), 3000);
      return;
    }

    try {
      const tenantId = user?.user?.tenantId;

      const feedbackData = {
        rating: parseInt(formData.rating), // Ensure rating is an integer
        description: formData.description,
        rentalId: rentalId,
        tenantId: tenantId,
      };

      const response = await axios.post('http://localhost:5555/feedbacks', feedbackData, {
        withCredentials: true, // If authentication is required
      });

      console.log('Feedback submitted successfully:', response.data);
      setSubmissionStatus('success');
      setFormData({ rating: '', description: '' }); // Clear the form
      setTimeout(() => setSubmissionStatus(null), 3000); // Clear status after a delay

    } catch (error) {
      console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus(null), 3000); // Clear status after a delay
    }
  };

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar className="renter-sidebar" activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="main-body">

          <h2>Feedback</h2>
          <div className="divider"></div>

          {submissionStatus === 'success' && (
            <div className="success-message">Feedback submitted successfully!</div>
          )}
          {submissionStatus === 'error' && (
            <div className="error-message">Failed to submit feedback. Please try again.</div>
          )}
          {submissionStatus === 'submitting' && (
            <div className="submitting-message">Submitting feedback...</div>
          )}

          {errorRental && (
            <div className="error-message">{errorRental}</div>
          )}

          <form onSubmit={handleSubmit} className="feedback-form" aria-live="polite">
            <div className="form-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="form-control"
                min="1"
                max="5"
                required // Make rating required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="8"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={!rentalId}>Submit</button>
            </div>
          </form>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackRenter;