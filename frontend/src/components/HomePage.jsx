import React, { useState } from "react";
// import './css/HomePage.css';

const HomePage = () => {
  // Placeholder data for properties that would be fetched from backend
  const [properties, setProperties] = useState([
    {
      id: 1,
      image: "/images/property1.jpg",
      title: "Amali House | South C",
      price: "Ksh 20,000",
      period: "/month",
      type: "Rental",
      isFavorite: false,
      isPopular: true,
    },
    {
      id: 2,
      image: "/images/property2.jpg",
      title: "Amali House | Eastleigh",
      price: "Ksh 20,000",
      period: "/month",
      type: "Rental",
      isFavorite: false,
      isPopular: true,
    },
    {
      id: 3,
      image: "/images/property3.jpg",
      title: "Amali House | Parklands",
      price: "Ksh 20,000",
      period: "/month",
      type: "Rental",
      isFavorite: false,
      isPopular: true,
    },
  ]);

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setProperties(
      properties.map((property) =>
        property.id === id
          ? { ...property, isFavorite: !property.isFavorite }
          : property
      )
    );
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState("renters");

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">PTOS</div>
        <div className="nav-links">
          <a href="#" className="active">
            Home
          </a>
          <a href="#">About us</a>
          <a href="#">Manage property</a>
          <a href="#">Dashboard</a>
        </div>
        <div className="auth-buttons">
          <a href="/login" className="login-btn">
            Login
          </a>
          <a href="/signup" className="signup-btn">
            Sign-up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Rental Property</h1>
          <p>
            A Great Platform to Connect users Directly with Property Managers
            and Discover Your Dream Home
          </p>
          <button className="get-started-btn">Get started</button>

          <div className="search-container">
            <h3>Search for properties</h3>
            <div className="search-bar">
              <div className="location-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="#4A5568"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  />
                </svg>
              </div>
              <input type="text" placeholder="Search by location..." />
              <button className="search-btn">Search</button>
            </div>
          </div>
        </div>
        <div className="map-container">
          {/* Map placeholder */}
          <div className="map-placeholder"></div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="feature-section">
        <div className="feature-image">
          <div className="looking-badge">
            <div className="house-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path fill="#fff" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className="badge-text">
              <h4>Looking for a home?</h4>
              <p>Browse through thousands of properties</p>
            </div>
          </div>
        </div>
        <div className="feature-content">
          <h2>What We Do</h2>
          <div className="tabs">
            <button
              className={activeTab === "renters" ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab("renters")}
            >
              For Renters
            </button>
            <button
              className={
                activeTab === "landlords" ? "tab-btn active" : "tab-btn"
              }
              onClick={() => setActiveTab("landlords")}
            >
              For Landlords
            </button>
          </div>
          <h3>We Simplify Your Rental Home Search</h3>
          <p>
            Experience hassle-free rental home searching with our platform. We
            simplify the process by linking you directly to legit property
            managers by cutting out the middleman
          </p>
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section">
        <div className="section-header">
          <h3 className="trending-label">Trending</h3>
          <h2>Trending Listings</h2>
        </div>
        <div className="properties-container">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <div className="property-image">
                <img
                  src={property.image || "https://via.placeholder.com/300x200"}
                  alt={property.title}
                />
                {property.isPopular && (
                  <span className="popular-tag">Popular</span>
                )}
              </div>
              <div className="property-details">
                <h3>{property.title}</h3>
                <div className="property-price">
                  <span className="price">{property.price}</span>
                  <span className="period">{property.period}</span>
                </div>
                <p className="property-type">{property.type}</p>
              </div>
              <button
                className={`favorite-btn ${
                  property.isFavorite ? "active" : ""
                }`}
                onClick={() => toggleFavorite(property.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill={property.isFavorite ? "#FF5A5F" : "none"}
                    stroke={property.isFavorite ? "#FF5A5F" : "#000"}
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
