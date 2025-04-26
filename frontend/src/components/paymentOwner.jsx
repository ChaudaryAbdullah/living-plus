"use client";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import "./css/paymentOwner.css";
import "./css/view-ratings.css";
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import Footer from "./Footer";
import axios from "axios";

const PaymentOwner = () => {
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [activeItem, setActiveItem] = useState("billing");
  const [activePage, setActivePage] = useState("Billing");
  const [tenants, setTenants] = useState([]);
  const [bills, setBills] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the correct base URL and endpoints
  const API_BASE_URL = "http://localhost:5556";

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
          await fetchOwnerData(response.data.user.ownerId);
        } else {
          console.error("Owner ID not found in user data");
          setError(
            "Owner ID not found. Please ensure you're logged in as an owner."
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(
          "Failed to load user profile. Please try refreshing the page."
        );
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchOwnerData = async (ownerId) => {
    try {
      console.log("Fetching data for owner ID:", ownerId);

      // 1. Get all rentals owned by this owner
      const rentalsRes = await axios.get(
        `${API_BASE_URL}/owns/rentals/${ownerId}`,
        {
          withCredentials: true,
        }
      );

      if (!Array.isArray(rentalsRes.data)) {
        setError("Invalid rental data format received from server");
        return;
      }

      const ownerRentalIds = rentalsRes.data.map((rental) => rental._id);
      console.log("Owner's rental IDs:", ownerRentalIds);

      // 2. Get all rent relationships
      const rentsRes = await axios.get(`${API_BASE_URL}/rents`, {
        withCredentials: true,
      });

      if (!Array.isArray(rentsRes.data)) {
        setError("Invalid rents data format received from server");
        return;
      }

      // 3. Filter rents to those associated with this owner's rentals
      const ownerRents = rentsRes.data.filter((rent) => {
        // Handle both populated and non-populated rental references
        const rentalId =
          typeof rent.rentalId === "object" ? rent.rentalId._id : rent.rentalId;
        return ownerRentalIds.includes(rentalId);
      });

      console.log("Filtered rents for owner's properties:", ownerRents);

      // 4. Extract unique tenants from owner-related rents
      const tenantsMap = new Map();

      ownerRents.forEach((rent) => {
        if (rent.tenantId) {
          // Make sure we handle both populated and unpopulated tenant references
          const tenant = rent.tenantId;
          const tenantId = typeof tenant === "object" ? tenant._id : tenant;

          if (!tenantsMap.has(tenantId)) {
            if (typeof tenant === "object") {
              // If tenant is populated, use the full object
              tenantsMap.set(tenantId, {
                _id: tenantId,
                fullName: `${tenant.firstName} ${tenant.lastName}`,
                firstName: tenant.firstName,
                lastName: tenant.lastName,
                email: tenant.email,
                userName: tenant.userName,
              });
            } else {
              // If it's just an ID, create a minimal tenant object
              tenantsMap.set(tenantId, {
                _id: tenantId,
                fullName: "Unknown Tenant",
              });
            }
          }
        }
      });

      const ownerTenants = Array.from(tenantsMap.values());
      console.log("Owner's tenants:", ownerTenants);

      // 5. Get all payments
      const paymentsRes = await axios.get(`${API_BASE_URL}/payment`, {
        withCredentials: true,
      });

      let allPayments = [];
      if (Array.isArray(paymentsRes.data)) {
        allPayments = paymentsRes.data;
      } else if (
        paymentsRes.data.payments &&
        Array.isArray(paymentsRes.data.payments)
      ) {
        allPayments = paymentsRes.data.payments;
      }

      // 6. Filter payments to only include those for owner's tenants
      const ownerTenantIds = Array.from(tenantsMap.keys());

      const ownerPayments = allPayments.filter((payment) => {
        const tenantId =
          typeof payment.tenantId === "object"
            ? payment.tenantId._id
            : payment.tenantId;
        return ownerTenantIds.includes(tenantId) && payment.status === false;
      });

      // 7. Format payments for display
      const formattedPayments = ownerPayments.map((payment) => {
        const tenantId =
          typeof payment.tenantId === "object"
            ? payment.tenantId._id
            : payment.tenantId;
        const tenant = tenantsMap.get(tenantId);

        return {
          id: payment._id,
          tenant: tenant ? tenant.fullName : "Unknown",
          amount: payment.total,
          dueDate: payment.dueDate,
          status: payment.status ? "Paid" : "Pending",
        };
      });

      // 8. Update state with the tenant data
      setTenants(ownerTenants);
      setBills(formattedPayments);
    } catch (error) {
      console.error("Error fetching owner data:", error);
      setError(
        "Failed to load data. Please check your connection or try again."
      );
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedTenant || !selectedDate || !amount) {
      toast.error("Please fill all required fields!", {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 30000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      // Find the tenant ID from the selected tenant name
      const tenant = tenants.find((t) => t.fullName === selectedTenant);

      if (!tenant) {
        toast.error("Tenant not found!", {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 30000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      // Create payment record
      const paymentData = {
        method: "Invoice",
        total: parseFloat(amount),
        status: false, // This correctly sets status to unpaid (false)
        tenantId: tenant._id,
        dueDate: selectedDate,
      };

      // Send the payment data to the backend
      await axios.post(`${API_BASE_URL}/payment`, paymentData, {
        withCredentials: true,
      });

      const notificationData = {
        tenantId: tenant._id,
        date: new Date().toISOString(),
        description: `New invoice of $${amount} due on ${selectedDate}.`,
      };
      console.log("Notification data:", notificationData);
      await axios.post(`${API_BASE_URL}/notifications`, notificationData, {
        withCredentials: true,
      });

      toast.success(
        `Invoice generated for ${selectedTenant} due on ${selectedDate}`,
        {
          // variants: success | info | warning | error | default
          position: "top-right",
          autoClose: 30000,
          hideProgressBar: false,
          draggable: true,
          theme: "colored",
        }
      );

      // Refresh the payments list
      if (user?.user?.ownerId) {
        await fetchOwnerData(user.user.ownerId);
      }

      // Reset form fields
      setAmount("");
      setSelectedDate("");
      setSelectedTenant("");
    } catch (error) {
      console.error("Error generating invoice:", error);

      toast.error("Failed to generate invoice. Please try again.", {
        // variants: success | info | warning | error | default
        position: "top-right",
        autoClose: 30000,
        hideProgressBar: false,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleSort = () => {
    const sortedBills = [...bills].sort((a, b) => {
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    setBills(sortedBills);
  };

  const filterBills = () => {
    let filteredBills = [...bills];

    if (selectedTenant) {
      filteredBills = filteredBills.filter((bill) =>
        bill.tenant.includes(selectedTenant)
      );
    }

    if (amount) {
      filteredBills = filteredBills.filter((bill) =>
        bill.amount.toString().includes(amount)
      );
    }

    if (status) {
      filteredBills = filteredBills.filter((bill) =>
        bill.status.toLowerCase().includes(status.toLowerCase())
      );
    }

    return filteredBills;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Header title={activePage} />

      <div className="main-content">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

        <div className="payment-section">
          <h2>Payment</h2>
          <div className="divider"></div>
          {error && (
            <div
              className="error-container"
              style={{
                marginBottom: "1rem",
                background: "#ffe0e0",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>Error</h3>
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                style={{ marginTop: "0.5rem" }}
              >
                Dismiss
              </button>
            </div>
          )}
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
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="Status"
              />
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
                        <span
                          className={`status-badge ${bill.status.toLowerCase()}`}
                        >
                          {bill.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
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
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
              >
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
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
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

            <button
              className="generate-invoice-btn"
              onClick={handleGenerateInvoice}
            >
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default PaymentOwner;
