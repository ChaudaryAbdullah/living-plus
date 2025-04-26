"use client";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./css/SignUp.css";
function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    address: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fix: Add handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    navigate("/"); // Redirects to home route
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const endpoints = [
        axios.post("http://localhost:5556/applicant", formData),
        axios.post("http://localhost:5556/tenant", formData),
        axios.post("http://localhost:5556/owner", formData),
      ];

      await Promise.all(endpoints);
      setSuccessMessage("Account created successfully!");

      toast.success("Account created successfully!", {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 30000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
      setFormData({
        userName: "",
        firstName: "",
        lastName: "",
        address: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      toast.error(`${err.response?.data?.message || "Something went wrong."}`, {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 30000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="signup-modal">
        <div className="modal-header">
          <h2>Sign-up</h2>
          <button href="/" className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <p className="description">
          Creating an account allows you to access your saved and contacted
          properties on any device
        </p>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange} // Now correctly defined
              required
            />
          </div>

          <div className="name-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="date-label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-group">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Retype Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Sign up
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
export default SignUp;
