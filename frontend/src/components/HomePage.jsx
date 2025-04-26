import React, { useState } from "react";
import "./css/HomePage.css";
import { href } from "react-router-dom";

const HomePage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">Living+</div>
        <div className="nav-links">
          <a href="#" className="active">
            Home
          </a>
          <a href="#about">About us</a>
          <a href="#manage">Manage property</a>
          <a href="http://localhost:5173/dashboard">Dashboard</a>
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
            Connecting users directly with property managers to discover their
            dream home.
          </p>
          <button
            className="get-started-btn"
            onClick={() => {
              window.location.href = "http://localhost:5173/login";
            }}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-properties">
        <h2>Featured Listings</h2>
        <div className="property-list">
          <div className="property-card">
            <img
              src="https://res.cloudinary.com/dsqfx4uwn/image/upload/v1745668151/rentals/qmyvagtzp6rlqmliughz.webp"
              alt="Property 1"
            />
            <h3>Alice Hostel | 123 elm Street</h3>
            <p>PKR 20,000 / month</p>
          </div>
          <div className="property-card">
            <img
              src="https://res.cloudinary.com/dsqfx4uwn/image/upload/v1745676282/rentals/wa333qd3c7wvjrvfekzj.jpg"
              alt="Property 2"
            />
            <h3>Dilawar Heights | 456 Maple Ave</h3>
            <p>PKR 50,000 / month</p>
          </div>
          <div className="property-card">
            <img
              src="https://res.cloudinary.com/dsqfx4uwn/image/upload/v1745668151/rentals/qmyvagtzp6rlqmliughz.webp"
              alt="Property 3"
            />
            <h3>Bussiness Lawn | 14 Willow Blvd</h3>
            <p>PKR 80,000 / month</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-us">
        <h2>About Us</h2>
        <div className="about-tabs">
          <button
            className={activeTab === "mission" ? "tab active" : "tab"}
            onClick={() => setActiveTab("mission")}
          >
            Our Mission
          </button>
          <button
            className={activeTab === "vision" ? "tab active" : "tab"}
            onClick={() => setActiveTab("vision")}
          >
            Our Vision
          </button>
          <button
            className={activeTab === "team" ? "tab active" : "tab"}
            onClick={() => setActiveTab("team")}
          >
            Meet the Team
          </button>
        </div>
        <div className="about-content">
          {activeTab === "mission" && (
            <p>
              Our mission is to make rental property searches effortless by
              providing a reliable platform for both renters and property
              managers.
            </p>
          )}
          {activeTab === "vision" && (
            <p>
              We envision a world where finding a home is seamless, transparent,
              and accessible to everyone.
            </p>
          )}
          {activeTab === "team" && (
            <p>
              Meet our passionate team dedicated to revolutionizing the rental
              industry.
            </p>
          )}
        </div>
      </section>

      {/* Right-Side Content Moved Below */}
      <section className="additional-info">
        <h2>Our Available Services</h2>
        <div className="services">
          <div className="service-card">Buy a Home</div>
          <div className="service-card">Rent a Home</div>
          <div className="service-card">Sell a Home</div>
        </div>

        <h2>Good Review By Customers</h2>
        <div className="customer-reviews">
          <div className="review-card">
            <h3>Jane Cooper</h3>
            <p>4.9 ⭐⭐⭐⭐</p>
            <p>A great experience working with this team.</p>
          </div>
          <div className="review-card">
            <h3>Brooklyn Simmons</h3>
            <p>5.0 ⭐⭐⭐⭐⭐</p>
            <p>Amazing services, highly recommend!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
