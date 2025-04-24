"use client";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
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
    rentalName: "",
    address: "",
    facilities: "",
    totalRooms: "",
    availableRooms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5556/rentals",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Rental registerd successfully!", {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
        setFormData({
          rentalName: "",
          address: "",
          facilities: "",
          totalRooms: "",
          availableRooms: "",
        });
      } else {
        toast.error("Failed to register rental. Please try again!", {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error registering hostel:", error);

      toast.error(
        "An error occurred while registering hostel. Please try again!",
        {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        }
      );
    }

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
                { id: "rentalName", label: "Hostel Name" },
                { id: "address", label: "Address" },
                { id: "facilities", label: "Amenities" },
                { id: "totalRooms", label: "Capacity" },
                { id: "availableRooms", label: "Available Rooms" },
              ].map(({ id, label }) => (
                <div className="form-group" key={id}>
                  <label
                    className="register-form-label"
                    style={{ textAlign: "left" }}
                    htmlFor={id}
                  >
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
      <ToastContainer />
    </div>
  );
};
export default HostelRegistrationForm;
