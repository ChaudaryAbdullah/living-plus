import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../components/dashboard"; // Update with the correct path
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for routing context

// Create a new instance of axios-mock-adapter
const mockAxios = new MockAdapter(axios);

describe("Dashboard", () => {
  beforeEach(() => {
    // Clear any previous mock requests
    mockAxios.reset();
  });

  it("renders the loading state initially", () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches user profile and rental data successfully", async () => {
    // Mock API responses
    mockAxios.onGet("http://localhost:5556/profile").reply(200, {
      user: { firstName: "John", lastName: "Doe", email: "john@example.com", dob: "1990-05-15", tenantId: "tenant123", ownerId: "owner123" }
    });

    mockAxios.onGet("http://localhost:5556/owner/owner123").reply(200, {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      dob: "1990-05-15"
    });

    mockAxios.onGet("http://localhost:5556/rents/tenant123").reply(200, [
      { _id: "rental1", rentalId: { rentalName: "Rental 1", address: "Address 1" }, roomId: { rtype: "Bedroom" }, amount: 500 }
    ]);

    mockAxios.onGet("http://localhost:5556/owns/rentals/owner123").reply(200, [
      { _id: "ownedRental1", rentalName: "Owned Rental 1", address: "Owned Address 1", availableRooms: 2, capacity: 5 }
    ]);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("Rented Rentals")).toBeInTheDocument());

    // Check if user info is rendered
    expect(screen.getByText(/Name: John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Email: john@example.com/)).toBeInTheDocument();
    
    // Check for age without hardcoding the specific value since it's calculated dynamically
    expect(screen.getByText(/Age:/)).toBeInTheDocument();

    // Check if rented rentals are displayed
    expect(screen.getByText("Rental 1")).toBeInTheDocument();
    expect(screen.getByText("Address 1")).toBeInTheDocument();
    expect(screen.getByText("Bedroom")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();

    // Check if owned rentals are displayed
    expect(screen.getByText("Owned Rental 1")).toBeInTheDocument();
    expect(screen.getByText("Owned Address 1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // Available rooms
    expect(screen.getByText("5")).toBeInTheDocument(); // Total capacity
  });

  it("displays an error message when the API call fails", async () => {
    // Mock API response to fail
    mockAxios.onGet("http://localhost:5556/profile").reply(500);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("Failed to load user profile.")).toBeInTheDocument());
  });

  it("displays rented rentals as empty when no data is available", async () => {
    // Mock the profile and owner API calls
    mockAxios.onGet("http://localhost:5556/profile").reply(200, {
      user: { firstName: "Jane", lastName: "Doe", email: "jane@example.com", dob: "1992-04-25", tenantId: "tenant456", ownerId: "owner456" }
    });
    
    mockAxios.onGet("http://localhost:5556/owner/owner456").reply(200, {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      dob: "1992-04-25"
    });

    // Empty rented rentals array
    mockAxios.onGet("http://localhost:5556/rents/tenant456").reply(200, []);
    
    // Mock owned rentals to avoid test failures
    mockAxios.onGet("http://localhost:5556/owns/rentals/owner456").reply(200, [
      { _id: "ownedRental1", rentalName: "Owned Rental 1", address: "Owned Address 1", availableRooms: 2, capacity: 5 }
    ]);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("You haven't rented any rentals yet.")).toBeInTheDocument());
  });

  it("displays owned rentals as empty when no data is available", async () => {
    // Mock the profile and owner API calls
    mockAxios.onGet("http://localhost:5556/profile").reply(200, {
      user: { firstName: "Jane", lastName: "Doe", email: "jane@example.com", dob: "1992-04-25", tenantId: "tenant456", ownerId: "owner456" }
    });
    
    mockAxios.onGet("http://localhost:5556/owner/owner456").reply(200, {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      dob: "1992-04-25"
    });

    // Mock rented rentals to avoid test failures
    mockAxios.onGet("http://localhost:5556/rents/tenant456").reply(200, [
      { _id: "rental1", rentalId: { rentalName: "Rental 1", address: "Address 1" }, roomId: { rtype: "Bedroom" }, amount: 500 }
    ]);
    
    // Empty owned rentals array
    mockAxios.onGet("http://localhost:5556/owns/rentals/owner456").reply(200, []);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByText("You haven't listed any rentals yet.")).toBeInTheDocument());
  });
});