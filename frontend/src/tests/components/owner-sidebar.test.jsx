/* eslint-env jest */
// src/tests/components/OwnerSidebar.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OwnerSidebar from '../../components/owner-sidebar';

// Mock setActiveItem
const mockSetActiveItem = jest.fn();

const renderSidebar = (activeItem = 'discover') => {
  render(
    <BrowserRouter>
      <OwnerSidebar activeItem={activeItem} setActiveItem={mockSetActiveItem} />
    </BrowserRouter>
  );
};

describe('OwnerSidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all sidebar menu items', () => {
    renderSidebar();

    expect(screen.getByText('Discover')).toBeInTheDocument();
    expect(screen.getByText('Owned Rental')).toBeInTheDocument();
    expect(screen.getByText('Rented Rental')).toBeInTheDocument();
    expect(screen.getByText('Register Hostel')).toBeInTheDocument();
    expect(screen.getByText('Add Rooms')).toBeInTheDocument();
    expect(screen.getByText('Allocate Parking')).toBeInTheDocument();
    expect(screen.getByText('Approve Applicants')).toBeInTheDocument();
    expect(screen.getByText('View Ratings')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('applies active class to the correct item', () => {
    renderSidebar('billing');

    const billingItem = screen.getByText('Billing').closest('li');
    expect(billingItem).toHaveClass('active');

    const discoverItem = screen.getByText('Discover').closest('li');
    expect(discoverItem).not.toHaveClass('active');
  });

  test('calls setActiveItem when a menu item is clicked', () => {
    renderSidebar();

    const addRoomsLink = screen.getByText('Add Rooms');
    fireEvent.click(addRoomsLink);

    expect(mockSetActiveItem).toHaveBeenCalledWith('add-rooms');
  });

  test('links point to the correct paths', () => {
    renderSidebar();

    expect(screen.getByText('Discover').closest('a')).toHaveAttribute('href', '/rental-view');
    expect(screen.getByText('Owned Rental').closest('a')).toHaveAttribute('href', '/owned-rentals');
    expect(screen.getByText('Rented Rental').closest('a')).toHaveAttribute('href', '/rented-rentals');
    expect(screen.getByText('Register Hostel').closest('a')).toHaveAttribute('href', '/register-hostel');
    expect(screen.getByText('Add Rooms').closest('a')).toHaveAttribute('href', '/addRooms');
    expect(screen.getByText('Allocate Parking').closest('a')).toHaveAttribute('href', '/approve-parking');
    expect(screen.getByText('Approve Applicants').closest('a')).toHaveAttribute('href', '/approveApplicants');
    expect(screen.getByText('View Ratings').closest('a')).toHaveAttribute('href', '/view-ratings');
    expect(screen.getByText('Billing').closest('a')).toHaveAttribute('href', '/payment-owner');
    expect(screen.getByText('Messages').closest('a')).toHaveAttribute('href', '/messages');
    expect(screen.getByText('Logout').closest('a')).toHaveAttribute('href', '/');
  });
});
