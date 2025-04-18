import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Dashboard.css"; // optional
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import Footer from "./Footer";

const ownedRentals = () => {
  const [activeItem, setActiveItem] = useState("owned-rentals");
  const [activePage, setActivePage] = useState("Owned Rentals");
  const [user, setUser] = useState(null);
  const [ownedRentals, setOwnedRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRentals = async (userData) => {
    try {
      const tenantId = userData?.tenantId;
      const ownerId = userData?.ownerId;
      console.log(tenantId, ownerId);
      const ownedRes = await axios.get(
        `http://localhost:5555/owns/rentals/${ownerId}`
      );

      console.log(ownedRes.data);

      setOwnedRentals(ownedRes.data);
    } catch (err) {
      console.error("Error fetching owner data:", err);
      setError("Failed to load owner data.");
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
            <h2>Owned Rentals</h2>
            {ownedRentals.length === 0 ? (
              <p>You haven't listed any rentals yet.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Rental Name</th>
                    <th>Address</th>
                    <th>Available Rooms</th>
                    <th>Total Rooms</th>
                  </tr>
                </thead>
                <tbody>
                  {ownedRentals.map((rental) => (
                    <tr key={rental._id}>
                      <td>{rental.rentalName}</td>
                      <td>{rental.address}</td>
                      <td>{rental.availableRooms}</td>
                      <td>{rental.capacity}</td>
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

export default ownedRentals;
