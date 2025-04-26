import { ToastContainer, toast } from "react-toastify";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rental, setRental] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeItem, setActiveItem] = useState("view-ratings");
  const [activePage, setActivePage] = useState("View Rental Details");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });
        const currentuser = res.data.user;
        console.log(currentuser);
        setCurrentUser(currentuser);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5556/rentals/${id}`);
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
          `http://localhost:5556/owns/${rentalId}`
        );
        setUser(response.data[0]);
      } catch (error) {
        console.error("Error fetching rental user details:", error);
        setError("Failed to load rental user details");
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
          <div className="image-slider-container">
            {rental.images && rental.images.length > 0 ? (
              <div className="image-slider">
                <img
                  src={rental.images[currentImageIndex]}
                  alt={`Rental Image ${currentImageIndex + 1}`}
                  className="rental-image"
                />

                {/* Left Button */}
                {rental.images.length > 1 && (
                  <button
                    className="slider-btn left"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? rental.images.length - 1 : prev - 1
                      )
                    }
                  >
                    ‹
                  </button>
                )}

                {/* Right Button */}
                {rental.images.length > 1 && (
                  <button
                    className="slider-btn right"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === rental.images.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    ›
                  </button>
                )}
              </div>
            ) : (
              <img src="/placeholder.svg" alt="No images available" />
            )}
          </div>

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
                {rental.facilities.join(", ")}
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
                {currentUser && currentUser.ownerId === user._id ? (
                  <p className="same-user-message">
                    You are the owner of this rental.
                  </p>
                ) : (
                  <button
                    className="view-contact-btn"
                    onClick={async () => {
                      try {
                        const profileRes = await axios.get(
                          "http://localhost:5556/profile",
                          {
                            withCredentials: true,
                          }
                        );
                        const applicantId = currentUser.id;
                        const ownerId = user._id;
                        const propertyId = rental._id;

                        const chatRes = await axios.get(
                          "http://localhost:5556/chat/findOrCreate",
                          {
                            params: { applicantId, ownerId, propertyId },
                          }
                        );

                        const chatId = chatRes.data._id;
                        window.location.href = `/chats?chatId=${chatId}`;
                      } catch (err) {
                        console.error("Error finding or creating chat:", err);
                        toast.error(
                          "Could not initiate chat. Please try again",
                          {
                            // variants: success | info | warning | error | default
                            position: "top-right",
                            autoClose: 30000,
                            hideProgressBar: false,
                            draggable: true,
                            theme: "colored",
                          }
                        );
                      }
                    }}
                  >
                    Contact Now
                  </button>
                )}
              </div>
            ) : (
              <p>Owner information not available.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ViewRentalDetails;
