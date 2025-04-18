import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "./css/Dashboard.css"; // optional

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [activePage, setActivePage] = useState("User Dashboard");
  const [user, setUser] = useState(null);
  const [rentedRentals, setRentedRentals] = useState([]);
  const [ownedRentals, setOwnedRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRentals = async (userData) => {
    try {
      const tenantId = userData?.tenantId;
      const ownerId = userData?.ownerId;
      console.log(tenantId, ownerId);
      const [userRes, rentedRes, ownedRes] = await Promise.all([
        axios.get(`http://localhost:5555/owner/${ownerId}`),
        axios.get(`http://localhost:5555/rents/${tenantId}`),
        axios.get(`http://localhost:5555/owns/rentals/${ownerId}`),
      ]);
      console.log(userRes.data);
      setUser(userRes.data);
      setRentedRentals(rentedRes.data);
      setOwnedRentals(ownedRes.data);
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

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="dashboard">
          <h1>User Dashboard</h1>
          {user && (
            <section className="dashboard-section user-info">
              <h2>User Information</h2>
              <div className="userData">
                <p>
                  <strong>Name:</strong> {user.firstName} {user.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Age:</strong> {calculateAge(user.dob)}
                </p>
              </div>
            </section>
          )}
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

export default Dashboard;
