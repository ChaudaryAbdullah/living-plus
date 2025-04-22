import React, { useState, useEffect } from 'react';
import './css/paymentRenter.css'; // Import specific CSS
import "./css/view-ratings.css"; // Import general CSS (if needed for other elements)
import Header from "./Header"; // Assuming these are in the same directory
import Sidebar from "./renter-sidebar";  // Assuming these are in the same directory
import axios from 'axios';
import { jsPDF } from 'jspdf';

const API_BASE_URL = "http://localhost:5555"

const PaymentRenter = () => {
    // States
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    
    // Filter states
    const [dueDateFilter, setDueDateFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [activeItem, setActiveItem] = useState("payment");
    const [activePage, setActivePage] = useState("Payment");

    // Fetch user profile to get tenant ID
    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/profile`, {
                withCredentials: true,
            });
            setUser(response.data);
            
            console.log("User data:", response.data);
            
            // Once we have the user data, fetch bills
            if (response.data?.user?.tenantId) {
                await fetchBills(response.data.user.tenantId);
            } else {
                console.error("Tenant ID not found in user data");
                setError("Tenant ID not found. Please ensure you're logged in as a tenant.");
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to load user profile. Please try refreshing the page.");
            setLoading(false);
        }
    };

    // Fetch bills from the API
    const fetchBills = async (tenantId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/payment/tenant/${tenantId}`, {
                withCredentials: true,
            });
            
            // Transform the data to match our component's structure
            const formattedBills = response.data.map(bill => ({
                id: bill._id,
                description: bill.description,
                amount: bill.total,
                dueDate: new Date(bill.dueDate).toISOString().split('T')[0],
                status: bill.paid ? 'Paid' : 'Unpaid'
            }));
            
            setBills(formattedBills);
        } catch (error) {
            console.error("Error fetching bills:", error);
            setError("Failed to load bills. Please try refreshing the page.");
        }
    };

    // Call fetchUser on component mount
    useEffect(() => {
        fetchUser();
    }, []);

    const handlePrintBill = (id) => {
        const billToPrint = bills.find(bill => bill.id === id);
    
        if (billToPrint) {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const textColor = '#333';
            const headerColor = '#007bff';
    
            // --- Header ---
            pdf.setFontSize(20);
            pdf.setTextColor(headerColor);
            const headerText = 'LIVINGPLUS Invoice';
            const headerX = (pageWidth - pdf.getTextWidth(headerText)) / 2;
            pdf.text(headerX, 20, headerText);
    
            pdf.setLineWidth(0.5);
            pdf.setDrawColor(headerColor);
            pdf.line(15, 25, pageWidth - 15, 25);
            pdf.setTextColor(textColor);
            pdf.setFontSize(12);
    
            // --- User Information ---
            const userName = user?.user?.name || 'Tenant'; // Use actual user name from state
            pdf.text(15, 40, `Tenant: ${userName}`);
    
            // --- Bill Details ---
            pdf.setFontSize(16);
            pdf.text(15, 55, `Bill Details - ${billToPrint.description}`);
            pdf.setFontSize(12);
    
            pdf.text(15, 70, `Description: ${billToPrint.description}`);
            pdf.text(15, 80, `Amount Due: $${billToPrint.amount.toFixed(2)}`);
            pdf.text(15, 90, `Due Date: ${new Date(billToPrint.dueDate).toLocaleDateString()}`);
            pdf.text(15, 100, `Status: ${billToPrint.status}`);
    
            // --- Footer ---
            pdf.setFontSize(10);
            pdf.setTextColor(textColor);
            const footerText = 'Thank you for your payment!';
            const footerX = (pageWidth - pdf.getTextWidth(footerText)) / 2;
            pdf.text(footerX, pdf.internal.pageSize.getHeight() - 10, footerText);
    
            // Open in a new browser tab
            window.open(pdf.output('bloburl'), '_blank');
        } else {
            console.error(`Bill with ID ${id} not found.`);
        }
    };

    const handlePayBill = async (paymentId) => {
        try {
          // First, fetch the current payment details
          const { data: existingPayment } = await axios.get(`${API_BASE_URL}/payment/${paymentId}`, {
            withCredentials: true,
          });
      
          // Prepare the updated payment data with status set to "paid"
          const updatedPayment = {
            method: existingPayment.method,
            total: existingPayment.total,
            status: "true", // only this field changes
            tenantId: existingPayment.tenantId._id || existingPayment.tenantId, // handle populated or raw ID
            dueDate: existingPayment.dueDate,
          };
      
          // Send the update request
          await axios.put(`${API_BASE_URL}/payment/${paymentId}`, updatedPayment, {
            withCredentials: true,
          });
      
          // Update UI
          setBills(prevBills =>
            prevBills.map(bill =>
              bill._id === paymentId ? { ...bill, status: "paid" } : bill
            )
          );
      
          alert("Payment marked as paid successfully!");
        } catch (error) {
          console.error(`Error marking payment ${paymentId} as paid:`, error);
          setError("Failed to mark payment as paid. Please try again.");
        }
      };
      

    // Filter bills based on filter inputs
    const filteredBills = bills.filter(bill => {
        return (
            (dueDateFilter === '' || bill.dueDate.includes(dueDateFilter)) &&
            (amountFilter === '' || bill.amount.toString().includes(amountFilter)) &&
            (statusFilter === '' || bill.status.toLowerCase().includes(statusFilter.toLowerCase())) &&
            bill.status === 'Unpaid' // Only show unpaid bills
        );
    });

    const handleSort = () => {
        // Sort by due date
        const sortedBills = [...bills].sort((a, b) =>
            new Date(a.dueDate) - new Date(b.dueDate)
        );
        setBills(sortedBills);
    };

    if (loading) {
        return <div className="loading">Loading bills...</div>;
    }


    return (
        <div className="app-container">
            <Header title={activePage} />
            <div className="main-content">
                <Sidebar activeItem={activeItem} setActiveItem={setActiveItem}/>
                <div className="main-body">
                {error && (
                        <div className="error-container" style={{ marginBottom: "1rem", background: "#ffe0e0", padding: "1rem", borderRadius: "8px" }}>
                        <h3>Error</h3>
                        <p>{error}</p>
                        <button onClick={() => setError(null)} style={{ marginTop: "0.5rem" }}>Dismiss</button>
                        </div>
                    )}
                    <div className="payment-header">
                        <h1>Payment</h1>
                        <button className="sort-button" onClick={handleSort}>
                            <span className="sort-icon">⇅</span> Sort
                        </button>
                    </div>


                    <div className="filters">
                        <div className="filter-group">
                            <label>Due Date</label>
                            <input
                                type="text"
                                value={dueDateFilter}
                                onChange={(e) => setDueDateFilter(e.target.value)}
                                placeholder="Filter by date"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Amount</label>
                            <input
                                type="text"
                                value={amountFilter}
                                onChange={(e) => setAmountFilter(e.target.value)}
                                placeholder="Filter by amount"
                            />
                        </div>
                        <div className="filter-group">
                            <label>Status</label>
                            <input
                                type="text"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                placeholder="Filter by status"
                            />
                        </div>
                    </div>

                    <div className="bills-list">
                        {filteredBills.length === 0 ? (
                            <div className="no-bills">No unpaid bills found</div>
                        ) : (
                            filteredBills.map(bill => (
                                <div className="bill-item" key={bill.id}>
                                    <div className="bill-details">
                                        <div className="bill-description">{bill.description}</div>
                                        <div className="bill-amount">${bill.amount.toFixed(2)}</div>
                                        <div className="bill-due-date">Due: {new Date(bill.dueDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="bill-actions">
                                        <button
                                            className="print-bill-button"
                                            onClick={() => handlePrintBill(bill.id)}
                                        >
                                            Print Bill
                                        </button>
                                        <button
                                            className="pay-bill-button"
                                            onClick={() => handlePayBill(bill.id)}
                                        >
                                            Pay Bill
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentRenter;