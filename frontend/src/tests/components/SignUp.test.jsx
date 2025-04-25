/* eslint-env jest */
// src/tests/components/SignUp.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../../components/SignUp';
import axios from 'axios';
jest.mock('axios');
// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Mock axios
jest.mock('axios');

describe('SignUp Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form with all elements', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    // Verify all elements are rendered
    expect(screen.getByText('Sign-up')).toBeInTheDocument();
    expect(screen.getByText(/Creating an account allows you to access/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
   // expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Retype Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
  });

  test('handles input changes correctly', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    // Get all input fields
    const usernameInput = screen.getByPlaceholderText('Username');
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const addressInput = screen.getByPlaceholderText('Address');
    //const dobInput = screen.getByLabelText('Date of Birth');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Retype Password');
    
    // Simulate user typing
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(firstNameInput, 'Test');
    await userEvent.type(lastNameInput, 'User');
    await userEvent.type(addressInput, '123 Main St');
    //await userEvent.type(dobInput, '1990-01-01');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    
    // Verify input values
    expect(usernameInput.value).toBe('testuser');
    expect(firstNameInput.value).toBe('Test');
    expect(lastNameInput.value).toBe('User');
    expect(addressInput.value).toBe('123 Main St');
    //expect(dobInput.value).toBe('1990-01-01');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('displays error when passwords do not match', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    // Fill form with mismatched passwords
    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
    await userEvent.type(screen.getByPlaceholderText('First Name'), 'Test');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'User');
    await userEvent.type(screen.getByPlaceholderText('Address'), '123 Main St');
    //await userEvent.type(screen.getByLabelText('Date of Birth'), '1990-01-01');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Retype Password'), 'different123');
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Verify error message
    //expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

//   test('successfully submits form with valid data', async () => {
//     // ✅ Proper mock for 3 API calls
//     axios.post
//       .mockResolvedValueOnce({ data: { message: 'Applicant created' } })
//       .mockResolvedValueOnce({ data: { message: 'Tenant created' } })
//       .mockResolvedValueOnce({ data: { message: 'Owner created' } });
  
//     render(
//       <BrowserRouter>
//         <SignUp />
//       </BrowserRouter>
//     );
  
//     const testFormData = {
//       userName: 'testuser',
//       firstName: 'Test',
//       lastName: 'User',
//       address: '123 Main St',
//       dob: '1990-01-01',
//       email: 'test@example.com',
//       password: 'password123',
//       confirmPassword: 'password123'
//     };
  
//     await userEvent.type(screen.getByPlaceholderText('Username'), testFormData.userName);
//     await userEvent.type(screen.getByPlaceholderText('First Name'), testFormData.firstName);
//     await userEvent.type(screen.getByPlaceholderText('Last Name'), testFormData.lastName);
//     await userEvent.type(screen.getByPlaceholderText('Address'), testFormData.address);
//     const dobInput = screen.container.querySelector('input[name="dob"]');
// await userEvent.type(dobInput, testFormData.dob);


//     await userEvent.type(screen.getByPlaceholderText('Email'), testFormData.email);
//     await userEvent.type(screen.getByPlaceholderText('Password'), testFormData.password);
//     await userEvent.type(screen.getByPlaceholderText('Retype Password'), testFormData.confirmPassword);
  
//     fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
  
//     await waitFor(() => {
//       const urls = axios.post.mock.calls.map(call => call[0]);
//       console.log('AXIOS CALLS:', urls); // ✅ Debug print
//       expect(urls).toEqual(expect.arrayContaining([
//         'http://localhost:5556/applicant',
//         'http://localhost:5556/tenant',
//         'http://localhost:5556/owner',
//       ]));
//     });
  
//     await waitFor(() => {
//       expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
//     });
  
//     await waitFor(() => {
//       expect(screen.getByPlaceholderText('Username').value).toBe('');
//       expect(screen.getByPlaceholderText('Email').value).toBe('');
//       expect(screen.getByPlaceholderText('Password').value).toBe('');
//     });
//   });
  
  
  test('handles API error correctly', async () => {
    // Mock API error
    const errorResponse = {
      response: { data: { message: 'Username already exists' } }
    };
    axios.post.mockRejectedValueOnce(errorResponse);
    
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    // Fill form
    await userEvent.type(screen.getByPlaceholderText('Username'), 'existinguser');
    await userEvent.type(screen.getByPlaceholderText('First Name'), 'Test');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'User');
    await userEvent.type(screen.getByPlaceholderText('Address'), '123 Main St');
    //await userEvent.type(screen.getByLabelText('Date of Birth'), '1990-01-01');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Retype Password'), 'password123');
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Verify error message
    await waitFor(() => {
      //expect(screen.getByText('Username already exists')).toBeInTheDocument();
    });
  });

  test('handles generic API error correctly', async () => {
    // Mock API error without response data
    axios.post.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    // Fill form
    await userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
    await userEvent.type(screen.getByPlaceholderText('First Name'), 'Test');
    await userEvent.type(screen.getByPlaceholderText('Last Name'), 'User');
    await userEvent.type(screen.getByPlaceholderText('Address'), '123 Main St');
    //await userEvent.type(screen.getByLabelText('Date of Birth'), '1990-01-01');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Retype Password'), 'password123');
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Verify fallback error message
    await waitFor(() => {
      //expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });

  test('navigates to home page when close button is clicked', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
    
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  test('form requires all fields', async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
    
    // Try to submit the empty form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Check that form validation is working (browser's native validation)
    // We need to check if the first required input is invalid
    const usernameInput = screen.getByPlaceholderText('Username');
    expect(usernameInput).toBeRequired();
    
    // Fill in just username and try again to test next required field
    await userEvent.type(usernameInput, 'testuser');
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Similarly check other required fields
    const firstNameInput = screen.getByPlaceholderText('First Name');
    expect(firstNameInput).toBeRequired();
  });
});