"use client"

import { useState } from "react"
import "./css/register-hostel.css"
// Import specific icons from lucide-react
import { Home, MessageSquare, Layers, Settings, LogOut } from "lucide-react"

const RegisterHostel = () => {
  const [formData, setFormData] = useState({
    hostelName: "",
    address: "",
    amenities: "",
    additionalAmenities: "",
    capacity: "",
    availableRooms: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
  }

  return (
    <div className="hostel-registration-container">
      <div className="sidebar">
        <div className="sidebar-item">
          <Home size={24} />
          <span>Discover</span>
        </div>
        <div className="sidebar-item">
          <MessageSquare size={24} />
          <span>Messages</span>
        </div>
        <div className="sidebar-item">
          <Layers size={24} />
          <span>Add Rooms</span>
        </div>
        <div className="sidebar-item">
          <Settings size={24} />
          <span>Register Rental</span>
        </div>
        <div className="sidebar-item logout">
          <LogOut size={24} />
          <span>Logout</span>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="logo-section">
            <h2 className="logo">I-TUS</h2>
            <div className="divider">|</div>
            <h2 className="page-title">Register Hostel</h2>
          </div>
          <div className="action-buttons">
            <button className="start-listing-btn">Start Listing</button>
            <div className="font-size-toggle">AA</div>
          </div>
        </div>

        <div className="form-container">
          <h3 className="section-title">Hostel Details</h3>
          <div className="divider-line"></div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="hostelName">Hostel Name</label>
              <input
                type="text"
                id="hostelName"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="form-group amenities-group">
              <label htmlFor="amenities">Amenities</label>
              <div className="amenities-inputs">
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="amenities-main"
                />
                <input
                  type="text"
                  id="additionalAmenities"
                  name="additionalAmenities"
                  value={formData.additionalAmenities}
                  onChange={handleChange}
                  className="amenities-additional"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity</label>
              <input type="text" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="availableRooms">Available Rooms</label>
              <input
                type="text"
                id="availableRooms"
                name="availableRooms"
                value={formData.availableRooms}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="apply-btn">
                Apply
              </button>
            </div>
          </form>
        </div>

        <div className="footer">
          <p className="copyright">© 2023 I-Tus Rental Management, Nairobi Kenya</p>
          <div className="footer-links">
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#support">Support & Resources</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterHostel