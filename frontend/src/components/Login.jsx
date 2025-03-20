import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Corrected Navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    navigate('/rental-view');
    // try {
    //   const response = await fetch("http://localhost:5000/api/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     alert("Login Successful!");
    //     navigate('/rental-view'); // ✅ Corrected navigation
    //   } else {
    //     alert(data.message || "Invalid login credentials");
    //   }
    // } catch (error) {
    //   console.error("Login error:", error);
    //   alert("Something went wrong. Please try again.");
    // }
  };

  const handleClose = () => {
    console.log('Close button clicked');
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>Login</h2>
          <button className="close-button" onClick={handleClose}>✕</button>
        </div>
        
        <button className="google-button">
          <img 
            src="/placeholder.svg?height=20&width=20" 
            alt="Google logo" 
            className="google-icon" 
          />
          Continue with Google
        </button>
        
        <div className="account-text">
          Don't have an account? <a href="/signup" className="create-link">Create One</a>
        </div>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
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
          
          <button  type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <div className="forgot-password">
          <a href="#">Forgot Password</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
