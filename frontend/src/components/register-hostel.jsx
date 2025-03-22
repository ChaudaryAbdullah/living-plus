"use client";
import { useState } from "react";
import "./css/register-hostel.css";
// Import specific icons from lucide-react
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Header from "./Header";

const RegisterHostel = () => {
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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <div className="hostel-registration-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <div className="main-content">
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
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
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
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
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

export default RegisterHostel;
