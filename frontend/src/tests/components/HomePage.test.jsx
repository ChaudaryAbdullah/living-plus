/* eslint-env jest */
// src/tests/components/HomePage.test.jsx

import React from 'react';
import { render, screen, fireEvent,waitFor  } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes } from 'react-router-dom';
import HomePage from '../../components/HomePage';

describe('HomePage Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders home page with all elements', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Verify all elements are rendered
    expect(screen.getByText('Living+')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Manage property')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign-up/i })).toBeInTheDocument();
    expect(screen.getByText('Find Your Perfect Rental Property')).toBeInTheDocument();
    expect(screen.getByText('Featured Listings')).toBeInTheDocument();
    expect(screen.getByText('Our Available Services')).toBeInTheDocument();
    expect(screen.getByText('Good Review By Customers')).toBeInTheDocument();
  });
  

//   test('navigates to login page when login button is clicked', () => {
//     // Create a mock for useNavigate
//     const navigateMock = jest.fn();
    
//     // Use jest.spyOn to mock useNavigate from react-router-dom
//     jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
  
//     render(
//       <BrowserRouter>
//         <HomePage />
//       </BrowserRouter>
//     );
  
//     // Find the login link using its text content
//     const loginButton = screen.getByText(/login/i);
//     fireEvent.click(loginButton);
  
//     // Verify that the navigate function was called with the correct path
//     expect(navigateMock).toHaveBeenCalledWith('/login');
//   });
  
//   test('navigates to sign-up page when sign-up button is clicked', () => {
//     // Create a mock for useNavigate
//     const navigateMock = jest.fn();
    
//     // Use jest.spyOn to mock useNavigate from react-router-dom
//     jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
  
//     render(
//       <BrowserRouter>
//         <HomePage />
//       </BrowserRouter>
//     );
  
//     // Find the sign-up link using its text content
//     const signUpButton = screen.getByText(/signup/i);
//     fireEvent.click(signUpButton);
  
//     // Verify that the navigate function was called with the correct path
//     expect(navigateMock).toHaveBeenCalledWith('/signup');
//   });
  

  test('displays correct property listings', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  
    // Wait for the property listings to appear in the DOM
    await waitFor(() => {
      // Verify that property listings are displayed correctly
      expect(screen.getByText('Alice Hostel | 123 elm Street')).toBeInTheDocument();
      expect(screen.getByText('PKR 20,000 / month')).toBeInTheDocument();
      expect(screen.getByText('Dilawar Heights | 456 Maple Ave')).toBeInTheDocument();
      expect(screen.getByText('PKR 50,000 / month')).toBeInTheDocument();
      expect(screen.getByText('Bussiness Lawn | 14 Willow Blvd')).toBeInTheDocument();
      expect(screen.getByText('PKR 80,000 / month')).toBeInTheDocument();
    });
  });

  test('changes active tab in About Us section', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Get the tabs in the About Us section
    const missionTab = screen.getByRole('button', { name: /our mission/i });
    const visionTab = screen.getByRole('button', { name: /our vision/i });
    const teamTab = screen.getByRole('button', { name: /meet the team/i });

    // Verify that the "Our Mission" content is displayed by default
    expect(screen.getByText(/Our mission is to make rental property searches effortless/i)).toBeInTheDocument();

    // Click "Our Vision" tab
    fireEvent.click(visionTab);
    expect(screen.getByText(/We envision a world where finding a home is seamless/i)).toBeInTheDocument();

    // Click "Meet the Team" tab
    fireEvent.click(teamTab);
    expect(screen.getByText(/Meet our passionate team/i)).toBeInTheDocument();

    // Click "Our Mission" tab again
    fireEvent.click(missionTab);
    expect(screen.getByText(/Our mission is to make rental property searches effortless/i)).toBeInTheDocument();
  });

  test('displays customer reviews correctly', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Verify that customer reviews are displayed correctly
    expect(screen.getByText('Jane Cooper')).toBeInTheDocument();
    expect(screen.getByText('4.9 ⭐⭐⭐⭐')).toBeInTheDocument();
    expect(screen.getByText('A great experience working with this team.')).toBeInTheDocument();
    expect(screen.getByText('Brooklyn Simmons')).toBeInTheDocument();
    expect(screen.getByText('5.0 ⭐⭐⭐⭐⭐')).toBeInTheDocument();
    expect(screen.getByText('Amazing services, highly recommend!')).toBeInTheDocument();
  });

  test('displays available services correctly', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Verify available services
    expect(screen.getByText('Buy a Home')).toBeInTheDocument();
    expect(screen.getByText('Rent a Home')).toBeInTheDocument();
    expect(screen.getByText('Sell a Home')).toBeInTheDocument();
  });

  test('handles "Get Started" button click', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Verify navigation on clicking "Get Started"
    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);
    expect(window.location.pathname).toBe('/');  // Assuming Get Started redirects to signup
  });
});
