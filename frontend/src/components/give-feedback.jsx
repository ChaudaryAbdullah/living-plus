import { useState, useEffect } from "react";
import axios from "axios";
import "./css/give-feedback.css";
import "./css/view-ratings.css";
import Sidebar from "./renter-sidebar";
import Header from "./Header";
import Footer from "./Footer";

const GiveFeedback = () => {
  const [formData, setFormData] = useState({
    rental: "", // Stores rental ID instead of name
    rating: "",
    description: "",
  });
  const [activeItem, setActiveItem] = useState("add-ratings");
  const [activePage, setActivePage] = useState("Give FeedBack");
  const [userRentals, setUserRentals] = useState([]); // Rentals where user is a tenant
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5556/profile", {
          withCredentials: true,
        });
        setUser(response.data);
        setLoading(false);

        if (response.data) {
          fetchRentalsForUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
        setLoading(false);
      }
    };

    const fetchRentalsForUser = async (userData) => {
      try {
        console.log(userData);
        const response = await axios.get(
          `http://localhost:5556/rents/${userData.tenantId}`,
          { withCredentials: true }
        );
        setUserRentals(response.data);
      } catch (error) {
        console.error("Error fetching user rentals:", error);
        setError("Failed to load your rentals");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const getOwnerIdByRentalId = async (rentalId) => {
      try {
        const res = await axios.get(`http://localhost:5556/owns/${rentalId}`, {
          withCredentials: true
        });
    
        const rentalArray = res.data;
    
        if (!Array.isArray(rentalArray) || rentalArray.length === 0) {
          console.warn("No rental data found");
          return null;
        }
    
        const rental = rentalArray[0];
        const ownerId = rental._id; // Assuming this is the owner's ID
    
        return ownerId;
      } catch (error) {
        console.error("Failed to fetch owner by rentalId:", error);
        return null;
      }
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (!formData.rental || !formData.rating || !formData.description) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      console.log(user.user.tenantId);
      const feedbackData = {
        rating: parseInt(formData.rating),
        description: formData.description,
        rentalId: formData.rental, // Now storing the rental ID
        tenantId: user.user.tenantId,
      };
      console.log(feedbackData);

      console.log("Submitting Feedback:", feedbackData);

      const response = await axios.post(
        "http://localhost:5556/feedback",
        feedbackData,
        { withCredentials: true }
      );
      const ownerId = await getOwnerIdByRentalId(formData.rental);
            console.log("OwnerId", ownerId)
            const notificationData = {
                    tenantId: ownerId,
                    date: new Date().toISOString(),
                    description: `New Feedback has been sent.`
                  };
            console.log("Notification data:", notificationData);  
            await axios.post(`http://localhost:5556/notifications`, notificationData, {
              withCredentials: true
            });
      if (response.status === 201) {
        alert("Feedback submitted successfully!");
        setFormData({ rental: "", rating: "", description: "" });
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="app-container">
      <Header title={activePage} />
      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="main-body">
          <div className="feedback-container">
            <h1>Feedback</h1>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="rental">Rental</label>
                <select
                  id="rental"
                  name="rental"
                  value={formData.rental}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a rental
                  </option>
                  {userRentals.length > 0 ? (
                    userRentals.map((rental) => (
                      <option
                        key={rental.id || rental._id}
                        value={rental.id || rental._id}
                      >
                        {rental.rentalName}
                      </option>
                    ))
                  ) : (
                    <option disabled>No rentals found</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="Rate from 1-5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Please provide your feedback here..."
                  required
                ></textarea>
              </div>

              <div className="form-group submit-group">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GiveFeedback;
