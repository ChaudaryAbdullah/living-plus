"use client"

import { useState, useEffect } from "react"
import "./css/paymentOwner.css"
import "./css/view-ratings.css";
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import Footer from "./Footer";
import axios from "axios";

const PaymentOwner = () => {
  const [selectedTenant, setSelectedTenant] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("")
  const [activeItem, setActiveItem] = useState("payment");
  const [activePage, setActivePage] = useState("Payment");
  const [tenants, setTenants] = useState([]);
  const [bills, setBills] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use the correct base URL and endpoints
  const API_BASE_URL = "http://localhost:5555";
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
        
        console.log("User data:", response.data);
        
        // Once we have the user, fetch tenants and payments
        if (response.data?.user?.ownerId) {
          await fetchTenantsAndBills(response.data.user.ownerId);
        } else {
          console.error("Owner ID not found in user data");
          setError("Owner ID not found. Please ensure you're logged in as an owner.");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile. Please try refreshing the page.");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchTenantsAndBills = async (ownerId) => {
    try {
      console.log("Fetching data for owner ID:", ownerId);
      
      // Get tenants for this owner - adjust endpoint as needed
      const tenantsRes = await axios.get(`${API_BASE_URL}/tenant/owner/${ownerId}`, {
        withCredentials: true
      });
      
      console.log("Tenants response:", tenantsRes.data);
      
      // Get all payments - use the correct payment route
      const paymentsRes = await axios.get(`${API_BASE_URL}/payment`, {
        withCredentials: true
      });
      
      console.log("Payments response:", paymentsRes.data);
      
      // Check if tenant data has the expected structure
      if (!Array.isArray(tenantsRes.data)) {
        console.error("Tenants data is not an array:", tenantsRes.data);
        setError("Invalid tenant data format received from server");
        return;
      }
      
      // Filter payments for tenants of this owner
      const ownerTenantIds = tenantsRes.data.map(tenant => tenant._id);
      
      // Handle different possible payment data structures
      let formattedPayments = [];
      
      if (Array.isArray(paymentsRes.data)) {
        // If paymentsRes.data is directly an array of payments
        formattedPayments = paymentsRes.data.filter(payment => 
          payment.tenantId && ownerTenantIds.includes(
            typeof payment.tenantId === 'object' ? payment.tenantId._id : payment.tenantId
          )
        ).map(payment => ({
          id: payment._id,
          tenant: payment.tenantId?.fullName || 
                 (typeof payment.tenantId === 'string' ? 
                  tenantsRes.data.find(t => t._id === payment.tenantId)?.fullName || "Unknown" 
                  : "Unknown"),
          amount: payment.total,
          dueDate: payment.dueDate,
          status: payment.status ? "Paid" : "Pending",
        }));
      } else if (paymentsRes.data.payments && Array.isArray(paymentsRes.data.payments)) {
        // If paymentsRes.data has a 'payments' property that's an array
        formattedPayments = paymentsRes.data.payments.filter(payment => 
          payment.tenantId && ownerTenantIds.includes(
            typeof payment.tenantId === 'object' ? payment.tenantId._id : payment.tenantId
          )
        ).map(payment => ({
          id: payment._id,
          tenant: payment.tenantId?.fullName || 
                 (typeof payment.tenantId === 'string' ? 
                  tenantsRes.data.find(t => t._id === payment.tenantId)?.fullName || "Unknown" 
                  : "Unknown"),
          amount: payment.total,
          dueDate: payment.dueDate,
          status: payment.status ? "Paid" : "Pending",
        }));
      }
      
      console.log("Formatted payments:", formattedPayments);
      
      setTenants(tenantsRes.data);
      setBills(formattedPayments);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError("Failed to load tenants and payments. Please check the console for details.");
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedTenant || !selectedDate || !amount) {
      alert("Please fill all required fields");
      return;
    }
    
    try {
      // Find the tenant ID from the selected tenant name
      const tenant = tenants.find(t => t.fullName === selectedTenant);
      
      if (!tenant) {
        alert("Tenant not found");
        return;
      }
      
      // Create payment record
      const paymentData = {
        method: "Invoice",
        total: parseFloat(amount),
        status: false, // Set to pending by default
        tenantId: tenant._id,
        dueDate: selectedDate
      };
      
      // Use the correct payment endpoint
      await axios.post(`${API_BASE_URL}/payment`, paymentData, {
        withCredentials: true
      });
      
      alert(`Invoice generated for ${selectedTenant} due on ${selectedDate}`);
      
      // Refresh the payments list
      if (user?.user?.ownerId) {
        fetchTenantsAndBills(user.user.ownerId);
      }
      
      // Reset form fields
      setAmount("");
      setSelectedDate("");
      setSelectedTenant("");
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  }

  const handleSort = () => {
    const sortedBills = [...bills].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
    setBills(sortedBills)
  }

  const filterBills = () => {
    let filteredBills = [...bills]

    if (selectedTenant) {
      filteredBills = filteredBills.filter((bill) => bill.tenant.includes(selectedTenant))
    }

    if (amount) {
      filteredBills = filteredBills.filter((bill) => bill.amount.toString().includes(amount))
    }

    if (status) {
      filteredBills = filteredBills.filter((bill) => bill.status.toLowerCase().includes(status.toLowerCase()))
    }

    return filteredBills
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="app-container">
        <Header title={activePage} />
        <div className="main-content">
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
          <div className="payment-section">
            <div className="error-container">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        <div className="payment-section">
          <h2>Payment</h2>
          <div className="divider"></div>

          <div className="filters">
            <div className="filter-group">
              <label>Select Tenant</label>
              <input
                type="text"
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                placeholder="Search Tenant"
              />
            </div>

            <div className="filter-group">
              <label>Amount</label>
              <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
            </div>

            <button className="sort-btn" onClick={handleSort}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
              Sort
            </button>
          </div>

          <div className="bills-table">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filterBills().length > 0 ? (
                  filterBills().map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.tenant}</td>
                      <td>${bill.amount}</td>
                      <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${bill.status.toLowerCase()}`}>{bill.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: "center", padding: "20px"}}>
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="generate-invoice-section">
            <div className="select-tenant">
              <label>Select Tenant</label>
              <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)}>
                <option value="">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant._id} value={tenant.fullName}>
                    {tenant.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-date">
              <label>Due Date</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            
            <div className="amount-input">
              <label>Amount</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount" 
              />
            </div>

            <button className="generate-invoice-btn" onClick={handleGenerateInvoice}>
              Generate Invoice
            </button>
          </div>
        </div>

      <Footer/>
      </div>
    </div>
  )
}

export default PaymentOwner