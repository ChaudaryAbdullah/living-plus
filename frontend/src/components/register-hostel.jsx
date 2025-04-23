"use client";
import { useState } from "react";
import "./css/view-ratings.css";
import "./css/register-hostel.css";
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
            <div className="divider" />

            <form className="hostel-form" onSubmit={handleSubmit}>
              {[
                { id: "hostelName", label: "Hostel Name" },
                { id: "address", label: "Address" },
                { id: "amenities", label: "Amenities" },
                { id: "capacity", label: "Capacity" },
                { id: "availableRooms", label: "Available Rooms" },
              ].map(({ id, label }) => (
                <div className="form-group" key={id}>
                  <label className="register-form-label" htmlFor={id}>
                    {label}
                  </label>
                  <input
                    type="text"
                    id={id}
                    name={id}
                    value={formData[id]}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              ))}

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
