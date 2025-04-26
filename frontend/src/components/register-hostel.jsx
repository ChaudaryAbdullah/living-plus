"use client";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import "./css/view-ratings.css";
import "./css/register-hostel.css";
import Footer from "./Footer";
import Sidebar from "./owner-sidebar";
import Header from "./Header";

const HostelRegistrationForm = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState("register-hostel");
  const [activePage, setActivePage] = useState("Register Rental");
  const [formData, setFormData] = useState({
    rentalName: "",
    address: "",
    facilities: "",
    totalRooms: "",
    availableRooms: "",
    images: [], // make images an array, not a string!
    ownerId: "",
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });

        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: files, // store selected files
      ownerId: user.ownerId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("rentalName", formData.rentalName);
    data.append("address", formData.address);
    data.append("facilities", formData.facilities);
    data.append("totalRooms", formData.totalRooms);
    data.append("availableRooms", formData.availableRooms);
    data.append("ownerId", formData.ownerId);
    formData.images.forEach((file) => {
      data.append("images", file); // append multiple images
    });
    console.log(formData.images);
    try {
      const response = await axios.post("http://localhost:5556/rentals", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Rental registered successfully!", {
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
          images: [],
        });
      } else {
        toast.error("Failed to register rental. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error registering hostel:", error);

      toast.error("All feilds are required. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
    }
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

              <div className="form-group">
                <label
                  className="register-form-label"
                  style={{ textAlign: "left" }}
                  htmlFor="images"
                >
                  Upload Pictures
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
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
      <ToastContainer />
    </div>
  );
};

export default HostelRegistrationForm;
