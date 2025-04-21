"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import "./css/approveApplicants.css";
import "./css/view-ratings.css";

const ApproveApplicants = () => {
  const [properties, setProperties] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState("approve-applicants");
  const [activePage, setActivePage] = useState("Approve Applicant");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });

        if (response.data?.user?.ownerId) {
          fetchRentalsForUser(response.data.user.ownerId);
        }
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchRentalsForUser = async (ownerId) => {
    try {
      const response = await axios.get(
        `http://localhost:5556/owns/rentals/${ownerId}`,
        { withCredentials: true }
      );

      setProperties(response.data);
      if (response.data.length > 0) {
        fetchApplicantsForUser(response.data.map((rental) => rental._id));
      }
    } catch (error) {
      console.error("Error fetching user rentals:", error);
      setError("No rental found!");
    }
  };

  const fetchApplicantsForUser = async (rentalIds) => {
    try {
      const promises = rentalIds.map((rentalId) =>
        axios.get(`http://localhost:5556/applyRental/rental/${rentalId}`, {
          withCredentials: true,
        })
      );

      const responses = await Promise.all(promises);
      const allApplicants = responses.flatMap((res) => res.data);
      setApplicants(allApplicants);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setError("Failed to load applicants");
    }
  };

  const handleAccept = async (applicationId) => {
    try {
      // Find the applicant from the current state
      const applicant = applicants.find((app) => app._id === applicationId);
      if (!applicant) {
        console.error("Applicant not found.");
        return;
      }
      console.log(applicant.roomId);
      // Fetch room details if required
      const roomResponse = await axios.get(
        `http://localhost:5556/rooms/${applicant.roomId._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(roomResponse.data);
      const room = roomResponse.data; // Assuming the first available room

      if (!room) {
        console.error("No available room found for this rental.");
        return;
      }

      const tenantResponse = await axios.get(
        `http://localhost:5556/tenant/${applicant.applicantId.email}`,
        {
          withCredentials: true,
        }
      );

      // Define rent amount (Modify as per business logic)
      const rentAmount = room.price || 500; // Default to 500 if not specified

      // Add the applicant to the Rent collection
      await axios.post(
        `http://localhost:5556/rents`,
        {
          amount: rentAmount,
          roomId: applicant.roomId._id,
          tenantId: tenantResponse.data._id, // Use applicantId as tenantId
          rentalId: applicant.rentalId._id,
        },
        { withCredentials: true }
      );

      // Remove applicant from applyRentals using applicantId
      await axios.delete(`http://localhost:5556/applyRental/${applicationId}`, {
        withCredentials: true,
      });

      // Update state
      setApplicants((prev) => prev.filter((app) => app._id !== applicationId));
      console.log(`Accepted applicant ${applicationId} and moved to Rent.`);
      alert("Application accepted successfully!");
    } catch (error) {
      console.error("Error accepting applicant:", error);
    }
  };

  const handleReject = async (applicantId) => {
    try {
      // Remove applicant from applyRentals using applicantId
      await axios.delete(`http://localhost:5556/applyRental/${applicantId}`, {
        withCredentials: true,
      });

      // Update state
      setApplicants((prev) => prev.filter((app) => app._id !== applicantId));
      alert("Application rejected successfully!");
      console.log(`Rejected applicant ${applicantId}.`);
    } catch (error) {
      console.error("Error rejecting applicant:", error);
    }
  };

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="main-body">
          {loading ? (
            <p>Loading applicants...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : applicants.length === 0 ? (
            <p>No applicants found.</p>
          ) : (
            <div className="applicants-grid">
              {applicants.map((applicant) => (
                <div className="applicant-card" key={applicant._id}>
                  <div className="applicant-info">
                    <h3>{applicant.applicantId.name}</h3>
                    <p className="property-name">
                      {applicant.rentalId.rentalName}
                    </p>
                    <p className="description">{applicant.applicantId.email}</p>
                    <p className="dob">{applicant.applicantId.dob}</p>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(applicant._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(applicant._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApproveApplicants;
