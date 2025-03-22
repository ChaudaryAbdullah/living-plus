import React, { useState } from "react";
import "./css/give-feedback.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

const GiveFeedback = () => {
  const [formData, setFormData] = useState({
    rental: "",
    rating: "",
    description: "",
  });

  const rentalOptions = [
    "Apartment 101",
    "House 202",
    "Condo 303",
    "Studio 404",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Feedback submitted successfully!");
    setFormData({
      rental: "",
      rating: "",
      description: "",
    });
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="main-content">
          <div className="feedback-container">
            <h1>Feedback</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="rental">Rental</label>
                <select
                  id="rental"
                  name="rental"
                  value={formData.rental}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a rental
                  </option>
                  {rentalOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="Rate from 1-5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Please provide your feedback here..."
                  required
                ></textarea>
              </div>

              <div className="form-group submit-group">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GiveFeedback;
