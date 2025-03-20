"use client"

import { useState } from "react"
import "./css/SignUp.css"

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible)
  }

  return (
    <div className="modal-overlay">
      <div className="signup-modal">
        <div className="modal-header">
          <h2>Sign-up</h2>
          <button className="close-button">✕</button>
        </div>

        <p className="description">
          Creating an account allows you to access your saved and contacted properties on any device
        </p>

        <button className="google-button">
          <img src="/placeholder.svg?height=20&width=20" alt="Google logo" className="google-icon" />
          Continue with Google
        </button>

        <div className="login-link">
          Already have an account ? <a href="/login">Login</a>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form className="signup-form">
          <div className="form-group">
            <input type="text" placeholder="Username" name="userName" required />
          </div>

          <div className="name-row">
            <div className="form-group">
              <input type="text" placeholder="First Name" name="firstName" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Last Name" name="lastName" required />
            </div>
          </div>

          <div className="form-group">
            <input type="text" placeholder="Address" name="address" required />
          </div>

          <div className="form-group">
            <label className="date-label">Date of Birth</label>
            <input type="date" name="dob" required />
          </div>

          <div className="form-group password-group">
            <input type={passwordVisible ? "text" : "password"} placeholder="Password" name="password" required />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              {passwordVisible ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="form-group password-group">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Retype Password"
              name="confirmPassword"
              required
            />
            <button type="button" className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
              {confirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button type="submit" className="signup-button">
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}

