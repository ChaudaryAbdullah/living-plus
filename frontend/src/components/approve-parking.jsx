"use client"

import { useState } from "react"
import "./css/approve-parking.css"

const ApproveParking = () => {
  const [selectedRental, setSelectedRental] = useState("")
  const [parkingAmount, setParkingAmount] = useState("")
  const [selectedAction, setSelectedAction] = useState("")

  // Mock data for rentals dropdown
  const rentals = ["Rental 1", "Rental 2", "Rental 3", "Rental 4"]

  // Mock data for action dropdown
  const actions = ["Action 1", "Action 2", "Action 3"]

  const handleCreate = () => {
    console.log("Creating new parking:", { selectedRental, parkingAmount })
    // Add your create logic here
  }

  const handleAccept = () => {
    console.log("Accepting with action:", selectedAction)
    // Add your accept logic here
  }

  const handleReject = () => {
    console.log("Rejecting")
    // Add your reject logic here
  }

  return (
    <div className="parking-container">
      {/* Header from the provided image */}
      <div className="header">
        <div className="logo">LivingPlus</div>
        <div className="header-actions">
          <button className="start-listing-btn">Start Listing</button>
          <button className="profile-btn">AA</button>
        </div>
      </div>

      <div className="parking-content">
        <h1 className="parking-title">Parking</h1>

        <div className="form-group">
          <label>Select Rental</label>
          <select value={selectedRental} onChange={(e) => setSelectedRental(e.target.value)}>
            <option value="" disabled>
              Select...
            </option>
            {rentals.map((rental, index) => (
              <option key={index} value={rental}>
                {rental}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount of new parking</label>
          <input type="text" value={parkingAmount} onChange={(e) => setParkingAmount(e.target.value)} />
          <button className="create-btn" onClick={handleCreate}>
            Create
          </button>
        </div>

        <div className="table-container">
          <div className="table-header"></div>
          <div className="table-content">
            <p className="no-data">No columns in table</p>
          </div>
        </div>

        <div className="action-container">
          <select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
            <option value="" disabled>
              Select...
            </option>
            {actions.map((action, index) => (
              <option key={index} value={action}>
                {action}
              </option>
            ))}
          </select>
          <button className="accept-btn" onClick={handleAccept}>
            Accept
          </button>
          <button className="reject-btn" onClick={handleReject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApproveParking

