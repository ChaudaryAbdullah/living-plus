"use client";
import { useState } from "react";
import "./css/register-hostel.css";
import "./css/view-ratings.css";
// // Import specific icons from lucide-react
import Footer from "./Footer";
import Sidebar from "./owner-sidebar";
import Header from "./Header";

const HostelRegistrationForm = () => {
  const [activeItem, setActiveItem] = useState("register-hostel");
  const [activePage, setActivePage] = useState("Register Rental");
  const [formData, setFormData] = useState({
    hostelName: "",
    address: "",
    amenities: "",
    additionalAmenities: "",
    capacity: "",
    availableRooms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here to submit the form data
  };

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="main-body">
          <div className="form-container">
            <h2 className="form-title">Hostel Details</h2>
            <div className="divider"></div>

            <form className="hostel-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="hostelName">Hostel Name</label>
                <input
                  type="text"
                  id="hostelName"
                  name="hostelName"
                  value={formData.hostelName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="amenities">Amenities</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="amenities-main"
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="availableRooms">Available Rooms</label>
                <input
                  type="text"
                  id="availableRooms"
                  name="availableRooms"
                  value={formData.availableRooms}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="apply-btn">
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HostelRegistrationForm;
