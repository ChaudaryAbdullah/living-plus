import React, { useState, useEffect } from 'react';
import { Star, Home, MessageSquare, Users, User, LogOut, Filter, Search } from 'lucide-react';
import './css/view-ratings.css';
import OwnerSidebar from './owner-sidebar';
const ViewRatings = () => {
  // Mock data for properties
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    // Simulating data fetch from backend
    const fetchData = async () => {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          name: 'Property Name',
          address: 'Address',
          amenities: 'Ammeties',
          capacity: 'Capacity',
          rating: 4.5
        },
        {
          id: 2,
          name: 'Property Name',
          address: 'Address',
          amenities: 'Ammeties',
          capacity: 'Capacity',
          rating: 3.8
        },
        {
          id: 3,
          name: 'Property Name',
          address: 'Address',
          amenities: 'Ammeties',
          capacity: 'Capacity',
          rating: 4.2
        },
        {
          id: 4,
          name: 'Property Name',
          address: 'Address',
          amenities: 'Ammeties',
          capacity: 'Capacity',
          rating: 5.0
        },
        {
          id: 5,
          name: 'Property Name',
          address: 'Address',
          amenities: 'Ammeties',
          capacity: 'Capacity',
          rating: 3.5
        },
        {
          id: 6,
          name: 'Property Name',
          address: 'Address',
          amenities: 'Ammeties',
          capacity: 'Capacity',
          rating: 4.0
        }
      ];
      
      setProperties(mockData);
    };
    
    fetchData();
  }, []);
  
  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="star filled" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="star half-filled" size={16} />);
      } else {
        stars.push(<Star key={i} className="star" size={16} />);
      }
    }
    
    return stars;
  };
  
  return (
    <div className="app-container">
      {/* Sidebar */}
      <OwnerSidebar/>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1 className="logo">I-TUS</h1>
            <h2 className="page-title">Ratings</h2>
          </div>
          <div className="header-right">
            <button className="start-listing-btn">Start Listing</button>
            <div className="user-avatar">AA</div>
          </div>
        </header>
        
        {/* Filter Bar */}
        <div className="filter-bar">
          <button className="filter-btn">
            <Filter size={20} />
            Filter
          </button>
        </div>
        
        {/* Property Grid */}
        <div className="property-grid">
          {properties.map(property => (
            <div className="property-card" key={property.id}>
              <h3 className="property-name">{property.name}</h3>
              <p className="property-address">{property.address}</p>
              <p className="property-amenities">{property.amenities}</p>
              <p className="property-capacity">{property.capacity}</p>
              <div className="property-ratings">
                <p className="ratings-label">Ratings</p>
                <div className="stars-container">
                  {renderStars(property.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewRatings;