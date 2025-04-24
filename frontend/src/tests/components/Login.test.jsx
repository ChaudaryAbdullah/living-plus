/* eslint-env jest */
// src/tests/components/Login.test.jsx


// npm test           # Run all tests
// npm run test:watch # Run tests in watch mode (re-runs on file changes)
// npm run test:coverage 
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/Login';

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock fetch API
global.fetch = jest.fn();
global.alert = jest.fn();

describe('LoginForm Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form with all elements', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // Verify all elements are rendered
    //expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Create One')).toBeInTheDocument();
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  test('handles input changes correctly', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText('Username or Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Simulate user typing
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits the form with correct data and handles successful login', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { userName: 'testuser' } })
    });
    
    // Mock navigate function
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
    
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // Fill form
    await userEvent.type(screen.getByPlaceholderText('Username or Email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify fetch was called with correct params
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5556/profile/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      });
    });
    
    // Verify localStorage and navigation
    await waitFor(() => {
      expect(localStorage.getItem('data')).toBe('testuser');
      expect(alert).toHaveBeenCalledWith('Login Successful!');
      expect(navigateMock).toHaveBeenCalledWith('/rental-view');
    });
  });

  test('handles login failure correctly', async () => {
    // Mock failed API response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    });
    
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // Fill and submit form
    await userEvent.type(screen.getByPlaceholderText('Username or Email'), 'wrong@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify error handling
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Invalid credentials');
      expect(localStorage.getItem('data')).toBeNull();
    });
  });

  test('handles API error correctly', async () => {
    // Mock network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    // Fill and submit form
    await userEvent.type(screen.getByPlaceholderText('Username or Email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify error handling
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Something went wrong. Please try again.');
    });
  });

  test('navigates to home page when close button is clicked', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
    
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('Google sign-in button exists and is clickable', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    
    const googleButton = screen.getByText('Continue with Google');
    expect(googleButton).toBeInTheDocument();
    
    // Just test that the button can be clicked without errors
    fireEvent.click(googleButton);
  });
});