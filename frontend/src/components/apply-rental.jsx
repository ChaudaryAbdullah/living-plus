"use client"

import { useState, useEffect } from "react"
import "./css/apply-rental.css"
import { Home, MessageSquare, Bookmark, User, LogOut } from "lucide-react"

const ApplyRental = () => {
  // State for form data
  const [formData, setFormData] = useState({
    rentalId: "",
    roomType: "single",
  })

  // Placeholder data for rentals (would be fetched from backend)
  const [rentals, setRentals] = useState([
    { id: "1", name: "Apartment 101" },
    { id: "2", name: "Condo 202" },
    { id: "3", name: "House 303" },
  ])

  // Placeholder for properties (would be fetched from backend)
  const [properties, setProperties] = useState([
    { id: "1", name: "Property A", type: "Apartment", price: "$1200/month" },
    { id: "2", name: "Property B", type: "House", price: "$1800/month" },
    { id: "3", name: "Property C", type: "Condo", price: "$1500/month" },
  ])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would send the data to your backend
  }

  // Simulate fetching data from backend
  useEffect(() => {
    // This would be replaced with actual API calls
    console.log("Fetching data from backend...")
    // setRentals(fetchedRentals);
    // setProperties(fetchedProperties);
  }, [])

  return (
    <div className="rental-app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">I-TUS</div>
        <nav className="nav-menu">
          <div className="nav-item">
            <Home size={24} />
            <span>Discover</span>
          </div>
          <div className="nav-item">
            <MessageSquare size={24} />
            <span>Messages</span>
          </div>
          <div className="nav-item active">
            <Bookmark size={24} />
            <span>Add Rooms</span>
          </div>
          <div className="nav-item">
            <User size={24} />
            <span>Profile</span>
          </div>
          <div className="nav-item logout">
            <LogOut size={24} />
            <span>Logout</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            <h1>Apply for Rental</h1>
          </div>
          <div className="header-actions">
            <button className="start-listing-btn">Start Listing</button>
            <div className="avatar">AA</div>
          </div>
        </header>

        {/* Form Section */}
        <div className="form-section">
          <h2>Choose Rental</h2>
          <div className="form-divider"></div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="rentalSelect">Choose Rental</label>
              <select
                id="rentalSelect"
                name="rentalId"
                value={formData.rentalId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select a rental</option>
                {rentals.map((rental) => (
                  <option key={rental.id} value={rental.id}>
                    {rental.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="roomType">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="form-control"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
              </select>
            </div>

            <button type="submit" className="apply-btn">
              Apply
            </button>
          </form>

          {/* Properties Section */}
          <div className="properties-section">
            <h3>Available Properties</h3>
            <div className="properties-container">
              {properties.map((property) => (
                <div key={property.id} className="property-card">
                  <h4>{property.name}</h4>
                  <p>Type: {property.type}</p>
                  <p>Price: {property.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-left">
            <p>© 2023 I-Tus Rental Management, Nairobi Kenya</p>
          </div>
          <div className="footer-center">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
          <div className="footer-right">
            <a href="#">Support & Resources</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default ApplyRental

