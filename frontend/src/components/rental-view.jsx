import React, { useState } from 'react';
import './rental-view.css';

// Placeholder data - this would be replaced with data from your backend
const placeholderProperties = [
  {
    id: 1,
    title: 'Eastleigh 2nd Avenue',
    address: '2500 B 2nd Avenue For Sale',
    units: '10+ Units',
    beds: '2 Beds',
    bath: '1 bath',
    price: 'Ksh 200,000',
    applicants: 25,
    image: '/placeholder-house1.jpg'
  },
  {
    id: 2,
    title: 'Eastleigh 2nd Avenue',
    address: '2500 B 2nd Avenue opposite Road',
    units: '10+ Units available',
    beds: '2 Beds',
    bath: '1 bath',
    price: 'Ksh 200,000',
    applicants: 25,
    image: '/placeholder-house2.jpg'
  },
  {
    id: 3,
    title: 'Eastleigh 2nd Avenue',
    address: '2500 B 2nd Avenue opposite Road',
    units: '10+ Units available',
    price: 'Ksh 200,000',
    applicants: 25,
    image: '/placeholder-house3.jpg'
  },
  {
    id: 4,
    title: 'Eastleigh 2nd Avenue',
    address: '2500 B 2nd Avenue opposite Road',
    units: '10+ Units available',
    price: 'Ksh 200,000',
    applicants: 25,
    image: '/placeholder-house1.jpg'
  },
  {
    id: 5,
    title: 'Eastleigh 2nd Avenue',
    address: '2500 B 2nd Avenue opposite Road',
    units: '10+ Units available',
    price: 'Ksh 200,000',
    applicants: 25,
    image: '/placeholder-house2.jpg'
  },
  {
    id: 6,
    title: 'Eastleigh 2nd Avenue',
    address: '2500 B 2nd Avenue opposite Road',
    units: '10+ Units available',
    price: 'Ksh 200,000',
    applicants: 25,
    image: '/placeholder-house3.jpg'
  }
];

const RentalView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="rental-app">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">I-TUS</h1>
          <h2 className="header-title">Discover Properties</h2>
        </div>
        <button className="start-listing-btn">Start Listing</button>
        <div className="user-avatar">AA</div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <div className="nav-item active">
              <div className="nav-icon house-icon"></div>
              <span>Discover</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon message-icon"></div>
              <span>Messages</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon bookmark-icon"></div>
              <span>Saved Listings</span>
            </div>
            <div className="nav-item">
              <div className="nav-icon profile-icon"></div>
              <span>Profile</span>
            </div>
            <div className="nav-item logout">
              <div className="nav-icon logout-icon"></div>
              <span>Logout</span>
            </div>
          </nav>
        </aside>

        {/* Property Listings */}
        <main className="property-container">
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search for location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">
                <span className="search-icon">⌕</span>
              </button>
            </div>
            <button className="filter-btn">
              <span className="filter-icon">≡</span>
              Filter
            </button>
          </div>

          {/* Property Grid */}
          <div className="property-grid">
            {placeholderProperties.map(property => (
              <div className="property-card" key={property.id}>
                <div className="property-image">
                  <img src={property.image || "/placeholder.svg"} alt={property.title} />
                </div>
                <div className="property-details">
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-address">{property.address}</p>
                  <div className="property-specs">
                    <span className="property-units">{property.units}</span>
                    {property.beds && <span className="property-beds">{property.beds}</span>}
                    {property.bath && <span className="property-bath">{property.bath}</span>}
                  </div>
                  <div className="property-footer">
                    <span className="property-price">{property.price}</span>
                    <span className="property-applicants">Applicants {property.applicants}</span>
                  </div>
                  <button className="view-property-btn">View Property</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RentalView;
