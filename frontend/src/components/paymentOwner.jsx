"use client"

import { useState } from "react"
import "./css/paymentOwner.css"
import "./css/view-ratings.css";
import Header from "./Header";
import Sidebar from "./owner-sidebar";
import Footer from "./Footer";
// Mock data for tenants and their bills
const TENANTS_DATA = [
  { id: 1, name: "John Doe", bills: [{ amount: 1200, dueDate: "2023-05-15", status: "Paid" }] },
  { id: 2, name: "Jane Smith", bills: [{ amount: 950, dueDate: "2023-05-20", status: "Pending" }] },
  { id: 3, name: "Robert Johnson", bills: [{ amount: 1500, dueDate: "2023-05-10", status: "Overdue" }] },
  { id: 4, name: "Emily Wilson", bills: [{ amount: 1100, dueDate: "2023-05-25", status: "Pending" }] },
]

const PaymentOwner = () => {
  const [selectedTenant, setSelectedTenant] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("")
  const [activeItem, setActiveItem] = useState("payment");
  const [activePage, setActivePage] = useState("Payment");
  const [bills, setBills] = useState([
    { id: 1, tenant: "John Doe", amount: 1200, dueDate: "2023-05-15", status: "Paid" },
    { id: 2, tenant: "Jane Smith", amount: 950, dueDate: "2023-05-20", status: "Pending" },
    { id: 3, tenant: "Robert Johnson", amount: 1500, dueDate: "2023-05-10", status: "Overdue" },
    { id: 4, tenant: "Emily Wilson", amount: 1100, dueDate: "2023-05-25", status: "Pending" },
  ])

  const handleGenerateInvoice = () => {
    if (selectedTenant) {
      alert(`Invoice generated for ${selectedTenant} due on ${selectedDate || "N/A"}`)
    } else {
      alert("Please select a tenant")
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
      filteredBills = filteredBills.filter((bill) => bill.tenant === selectedTenant)
    }

    if (amount) {
      filteredBills = filteredBills.filter((bill) => bill.amount.toString().includes(amount))
    }

    if (status) {
      filteredBills = filteredBills.filter((bill) => bill.status.toLowerCase().includes(status.toLowerCase()))
    }

    return filteredBills
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
                placeholder="Select Tenant"
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
                {filterBills().map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.tenant}</td>
                    <td>${bill.amount}</td>
                    <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${bill.status.toLowerCase()}`}>{bill.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="generate-invoice-section">
            <div className="select-tenant">
              <label>Select Tenant</label>
              <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)}>
                <option value="">Select Tenant</option>
                {TENANTS_DATA.map((tenant) => (
                  <option key={tenant.id} value={tenant.name}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-date">
              <label>Due Date</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
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
