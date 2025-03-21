"use client"

import { useState } from "react"
import { Home, MessageSquare, BookmarkCheck, User, LogOut, Filter, Plus } from "lucide-react"
import "./css/approveApplicants.css"

const ApproveApplicants = () => {
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: "Applicant Name",
      property: "Property Name",
      description: "Description",
      email: "Email",
      dob: "Date of birth",
    },
    {
      id: 2,
      name: "Applicant Name",
      property: "Property Name",
      description: "Description",
      email: "Email",
      dob: "Date of birth",
    },
    {
      id: 3,
      name: "Applicant Name",
      property: "Property Name",
      description: "Description",
      email: "Email",
      dob: "Date of birth",
    },
    {
      id: 4,
      name: "Applicant Name",
      property: "Property Name",
      description: "Description",
      email: "Email",
      dob: "Date of birth",
    },
    {
      id: 5,
      name: "Applicant Name",
      property: "Property Name",
      description: "Description",
      email: "Email",
      dob: "Date of birth",
    },
    {
      id: 6,
      name: "Applicant Name",
      property: "Property Name",
      description: "Description",
      email: "Email",
      dob: "Date of birth",
    },
  ])

  const handleAccept = (id) => {
    // Handle accept logic
    console.log(`Accepted applicant ${id}`)
  }

  const handleReject = (id) => {
    // Handle reject logic
    console.log(`Rejected applicant ${id}`)
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">I-TUS</div>
        <nav className="nav-menu">
          <div className="nav-item">
            <Home size={20} />
            <span>Discover</span>
          </div>
          <div className="nav-item">
            <MessageSquare size={20} />
            <span>Messages</span>
          </div>
          <div className="nav-item active">
            <BookmarkCheck size={20} />
            <span>Approve Applicants</span>
          </div>
          <div className="nav-item">
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="nav-item logout">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
      </div>
      <div className="main-content">
        <header className="header">
          <h1>Approve Applicants</h1>
          <div className="header-actions">
            <button className="start-listing-btn">
              <Plus size={16} />
              Start Listing
            </button>
            <div className="user-avatar">AA</div>
          </div>
        </header>
        <div className="filter-container">
          <button className="filter-btn">
            <Filter size={16} />
            Filter
          </button>
        </div>
        <div className="applicants-grid">
          {applicants.map((applicant) => (
            <div className="applicant-card" key={applicant.id}>
              <div className="applicant-info">
                <h3>{applicant.name}</h3>
                <p className="property-name">{applicant.property}</p>
                <p className="description">{applicant.description}</p>
                <p className="email">{applicant.email}</p>
                <p className="dob">{applicant.dob}</p>
              </div>
              <div className="action-buttons">
                <button className="accept-btn" onClick={() => handleAccept(applicant.id)}>
                  Accept
                </button>
                <button className="reject-btn" onClick={() => handleReject(applicant.id)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ApproveApplicants

