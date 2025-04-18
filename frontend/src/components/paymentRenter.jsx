import React, { useState } from 'react';
import './css/paymentRenter.css'; // Import specific CSS
import "./css/view-ratings.css"; // Import general CSS (if needed for other elements)
import Header from "./Header"; // Assuming these are in the same directory
import Sidebar from "./renter-sidebar";  // Assuming these are in the same directory
import Footer from "./Footer"; // Assuming these are in the same directory
import { jsPDF } from 'jspdf';

const PaymentRenter = () => {
    // Sample data - in a real app, this would come from an API or props
    const [bills, setBills] = useState([
        { id: 1, description: 'Rent - January', amount: 1200, dueDate: '2025-01-15', status: 'Unpaid' },
        { id: 2, description: 'Utilities - January', amount: 150, dueDate: '2025-01-20', status: 'Unpaid' },
        { id: 3, description: 'Maintenance Fee', amount: 75, dueDate: '2025-01-25', status: 'Unpaid' },
    ]);

    // Filter states
    const [dueDateFilter, setDueDateFilter] = useState('');
    const [amountFilter, setAmountFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
     const [activeItem, setActiveItem] = useState("payment");
    const [activePage, setActivePage] = useState("Payment");

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
            const userName = 'John Doe'; // Replace with actual user name
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
    
            // If you still want to offer a download option as well, you can keep the pdf.save()
            // pdf.save(`invoice_${billToPrint.id}.pdf`);
        } else {
            console.error(`Bill with ID ${id} not found.`);
        }
    };

    const handlePayBill = (id) => {
        console.log(`Paying bill ${id}`);
        // In a real app, you would call an API to process payment
        // For demo, we'll just update the status
        setBills(bills.map(bill =>
            bill.id === id ? { ...bill, status: 'Paid' } : bill
        ));
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

    return (
        <div className="app-container">
             <Header title={activePage} />
            <div className="main-content">
                <Sidebar activeItem={activeItem} setActiveItem={setActiveItem}/>
                <div className="main-body">
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
