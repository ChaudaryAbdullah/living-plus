import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import { ToastContainer, toast } from "react-toastify";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Corrected Navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    console.log("Login attempt with:", { email, password });

    try {
      const response = await fetch("http://localhost:5556/profile/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }), // Send email and password
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.user);
        localStorage.setItem("data", data.user.userName);
        toast.success("Login Successful!", {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 30000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
        navigate("/rental-view"); // Navigate after login
      } else {
        toast.error(`${data.message || "Invalid login credentials."}`, {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error("Something went wrong. Please try again!", {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const handleClose = () => {
    navigate("/"); // Redirects to home route
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>Login</h2>
          <button
            className="close-button"
            onKeyDown={handleKeyDown}
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <button className="google-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="google-icon"
          >
            <g>
              <path
                d="M21.8,12.1c0-0.7-0.1-1.3-0.2-2H12v3.8h5.5c-0.2,1.2-0.9,2.3-2,3v2.5h3.2C20.5,17.8,21.8,15.2,21.8,12.1L21.8,12.1z"
                fill="#4285F4"
              />
              <path
                d="M12,22c2.7,0,5-0.9,6.7-2.4l-3.2-2.5c-0.9,0.6-2,1-3.5,1c-2.7,0-4.9-1.8-5.7-4.2H3v2.6C4.7,19.8,8.1,22,12,22L12,22z"
                fill="#34A853"
              />
              <path
                d="M6.3,13.8c-0.2-0.6-0.3-1.2-0.3-1.8s0.1-1.2,0.3-1.8V7.6H3C2.4,9,2,10.4,2,12s0.4,3,1,4.4L6.3,13.8L6.3,13.8z"
                fill="#FBBC05"
              />
              <path
                d="M12,6.6c1.5,0,2.9,0.5,3.9,1.5l2.9-2.9C17.1,3.6,14.8,2.7,12,2.7C8.1,2.7,4.7,4.9,3,8.3l3.3,2.6C7.1,8.4,9.3,6.6,12,6.6L12,6.6z"
                fill="#EA4335"
              />
            </g>
          </svg>
          Continue with Google
        </button>

        <div className="account-text">
          Don't have an account?{" "}
          <a href="/signup" className="create-link">
            Create One
          </a>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text" // Changed from "email" to "text"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="forgot-password">
          <a href="#">Forgot Password</a>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
