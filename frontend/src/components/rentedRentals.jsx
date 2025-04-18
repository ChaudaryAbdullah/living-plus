import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Dashboard.css"; // optional
import Header from "./Header";
import Sidebar from "./renter-sidebar";
import Footer from "./Footer";

const rentedRentals = () => {
  const [activeItem, setActiveItem] = useState("rented-rentals");
  const [activePage, setActivePage] = useState("Rented Rentals");
  const [user, setUser] = useState(null);
  const [rentedRentals, setRentedRentals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRentals = async (userData) => {
    try {
      const tenantId = userData?.tenantId;
      const ownerId = userData?.ownerId;
      console.log(tenantId, ownerId);
      const rentedRes = await axios.get(
        `http://localhost:5555/rents/${tenantId}`
      );

      setRentedRentals(rentedRes.data);
    } catch (err) {
      console.error("Error fetching rental data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5555/profile", {
          withCredentials: true,
        });

        const userData = response.data.user;
        setUser(userData);

        if (userData?.tenantId || userData?.ownerId) {
          fetchRentals(userData);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile.");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="dashboard">
          <section className="dashboard-section">
            <h2>Rented Rentals</h2>
            {rentedRentals.length === 0 ? (
              <p>You haven't rented any rentals yet.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Rental Name</th>
                    <th>Address</th>
                    <th>Room Type</th>
                    <th>Rent</th>
                  </tr>
                </thead>
                <tbody>
                  {rentedRentals.map((rental) => (
                    <tr key={rental._id}>
                      <td>{rental.rentalId.rentalName}</td>
                      <td>{rental.rentalId.address}</td>
                      <td>{rental.roomId.rtype}</td>
                      <td>{rental.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default rentedRentals;
