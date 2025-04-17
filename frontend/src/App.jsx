import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";
import SignUp from "./components/signUp";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import RentalView from "./components/rental-view";
import AddRooms from "./components/AddRooms";
import ApplyRental from "./components/apply-rental";
import ApplyParking from "./components/applyParking";
import ApproveApplicants from "./components/ApproveApplicants";
import RegisterHostel from "./components/register-hostel";
import GiveFeedback from "./components/give-feedback";
import ApproveParking from "./components/approve-parking";
import ViewRatings from "./components/view-ratings";
import Chats from "./components/chats";
import ViewNotifications from "./components/view-notifications";
import ViewRentalDetails from "./components/viewRentalDetails";
import Dashboard from "./components/dashboard";

import { AuthGuard } from "./temp.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkSession = () => {
    setUser(localStorage.getItem("data"));
    setLoading(false);
  };

  // Run session check on first load
  useEffect(() => {
    checkSession();
  }, []);

  // Handle logout function
  const handleLogout = async () => {
    await fetch("http://localhost:5555/profile/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "http://localhost:5555//login"; // Redirect to login page
  };

  if (loading) return <p>Loading...</p>; // Show loading screen while checking session

  return (
    <div className="app">
      <Router>
        <AuthGuard />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rental-view" element={<RentalView />} />
          <Route path="/addRooms" element={<AddRooms />} />
          <Route path="/apply-rental" element={<ApplyRental />} />
          <Route path="/applyParking" element={<ApplyParking />} />
          <Route path="/approveApplicants" element={<ApproveApplicants />} />
          <Route path="/register-hostel" element={<RegisterHostel />} />
          <Route path="/give-feedback" element={<GiveFeedback />} />
          <Route path="/approve-parking" element={<ApproveParking />} />
          <Route path="/view-ratings" element={<ViewRatings />} />
          <Route path="/chats/:id" element={<Chats />} />
          <Route path="/view-notifications" element={<ViewNotifications />} />
          <Route path="/rental/:id" element={<ViewRentalDetails />} />
          <Route path="/dashboard/" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
