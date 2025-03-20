"use client"

import { useState } from "react"
import "./css/AddRooms.css"
import { Home, MessageSquare, BookOpen, User, LogOut } from "lucide-react"
import Header from "./Header";
import Sidebar from "./Sidebar";
const AddRooms = () => {
  // Placeholder data - would be fetched from backend
  const [rentals, setRentals] = useState([
    { id: 1, name: "Apartment 101" },
    { id: 2, name: "Villa 205" },
    { id: 3, name: "Condo 310" },
  ])

  const [formData, setFormData] = useState({
    rentalId: "",
    roomType: "",
    dimensions: "",
    description: "",
    price: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // This would send data to backend
    console.log("Form submitted:", formData)
  }

  return (
    <div className="app-container">
      {/* Header */}
      <Header/>

      <div className="content-container">
        {/* Sidebar */}
        <Sidebar/>

        {/* Main Content */}
        <main className="main-content">
        <div class="form-container">
          <h2 className="page-title">Add Rooms</h2>
          <div className="divider"></div>

          <form className="add-room-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rentalId">Select Rental</label>
                <select
                  id="rentalId"
                  name="rentalId"
                  value={formData.rentalId}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select a rental</option>
                  {rentals.map((rental) => (
                    <option key={rental.id} value={rental.id}>
                      {rental.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="roomType">Room Type</label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select room type</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                </select>
              </div>
            </div>

            

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Add Rooms
              </button>
            </div>
          </form>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">© 2023 I-Tus Rental Management, Nairobi Kenya</div>
        <div className="footer-center">
          <a href="#" className="footer-link">
            Terms
          </a>
          <a href="#" className="footer-link">
            Privacy
          </a>
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">
            Support & Resources
          </a>
        </div>
      </footer>
    </div>
  )
}

export default AddRooms

