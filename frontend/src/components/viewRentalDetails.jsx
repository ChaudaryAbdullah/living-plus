import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./css/view-ratings.css";
import "./css/viewRentalDetails.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const ViewRentalDetails = () => {
  const { id } = useParams(); // URL param from /rental/:id
  const [rental, setRental] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState("view-ratings");
  const [activePage, setActivePage] = useState("View Rental Details");

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5555/rentals/${id}`);
        setRental(res.data);
        if (res.data) {
          fetchUser(res.data._id);
        }
      } catch (err) {
        console.error("Error fetching rental details:", err);
        setError("Failed to load rental details");
        setLoading(false);
      }
    };

    const fetchUser = async (rentalId) => {
      try {
        const response = await axios.get(
          `http://localhost:5555/owns/${rentalId}`
        );
        setUser(response.data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!rental) return <p>No rental found.</p>;

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        <div className="main-body">
          <img
            src={rental.image || "/placeholder.svg"}
            alt={rental.rentalName}
          />
          <div className="rental-grid">
            <div className="rental-details">
              <h1>{rental.rentalName}</h1>
              <p>
                <strong>Address: </strong> {rental.address}
              </p>
              <p>
                <strong>Total Rooms: </strong>
                {rental.capacity}
              </p>
              <p>
                <strong>Available Rooms: </strong>
                {rental.availableRooms}
              </p>
              <p>
                <strong>Facilities: </strong>
                {rental.amenities.join(", ")}
              </p>
            </div>

            {user ? (
              <div className="owner-details">
                <h1>Owner</h1>
                <p>
                  <strong>Name: </strong>
                  {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Email: </strong>
                  {user.email}
                </p>
                <Link to={`/chats/${rental._id}`} className="view-contact-btn">
                  Contact Now
                </Link>
              </div>
            ) : (
              <p>Owner information not available.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewRentalDetails;
