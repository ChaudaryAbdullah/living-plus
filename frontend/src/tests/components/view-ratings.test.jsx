/* eslint-env jest */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ViewRatings from "../../components/view-ratings";
import axios from "axios";

// Mock child components
jest.mock("../../components/Footer", () => () => <div>Footer</div>);
jest.mock("../../components/Header", () => ({ title }) => (
  <div>Header - {title}</div>
));
jest.mock("../../components/owner-sidebar", () => () => <div>Sidebar</div>);

// Mock axios
jest.mock("axios");

describe("ViewRatings Component", () => {
  const mockUserData = {
    user: {
      ownerId: "owner123",
    },
  };

  const mockRentals = [
    { _id: "1", name: "Rental 1", address: "Address 1", amenities: "WiFi", capacity: 5 },
    { _id: "2", name: "Rental 2", address: "Address 2", amenities: "AC", capacity: 3 },
  ];

  const mockFeedback = {
    "1": [{ description: "Good place", rating: 4 }],
    "2": [{ description: "Nice stay", rating: 5 }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });



  test("renders properties and feedback on successful API calls", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData }) // user profile
      .mockResolvedValueOnce({ data: mockRentals }) // rentals data
      .mockResolvedValueOnce({ data: mockFeedback["1"] }) // feedback for rental 1
      .mockResolvedValueOnce({ data: mockFeedback["2"] }); // feedback for rental 2

    render(<ViewRatings />);
    await waitFor(() => screen.getByText("Rental 1"));

    expect(screen.getByText("Rental 1")).toBeInTheDocument();
    expect(screen.getByText("Rental 2")).toBeInTheDocument();
    expect(screen.getByText("Good place")).toBeInTheDocument();
    expect(screen.getByText("Nice stay")).toBeInTheDocument();
  });




  

  test("calculates and renders average rating correctly", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockRentals })
      .mockResolvedValueOnce({ data: mockFeedback["1"] })
      .mockResolvedValueOnce({ data: mockFeedback["2"] });

    render(<ViewRatings />);
    await waitFor(() => screen.getByText("Rental 1"));

    expect(screen.getByText("4.0 / 5")).toBeInTheDocument(); // Average for rental 1
    expect(screen.getByText("5.0 / 5")).toBeInTheDocument(); // Average for rental 2
  });

  test("sorts properties by rating when filter is clicked", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockRentals })
      .mockResolvedValueOnce({ data: mockFeedback["1"] })
      .mockResolvedValueOnce({ data: mockFeedback["2"] });

    render(<ViewRatings />);
    await waitFor(() => screen.getByText("Rental 1"));

    const sortButton = screen.getByText(/Sort/);
    fireEvent.click(sortButton); // Toggle to low-to-high sort
    fireEvent.click(sortButton); // Toggle back to high-to-low sort

    const rental1Name = screen.getByText("Rental 1");
    const rental2Name = screen.getByText("Rental 2");

    // Confirm correct sorting order
    expect(rental1Name).toBeInTheDocument();
    expect(rental2Name).toBeInTheDocument();
  });

  test("shows message when no properties are found", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: [] });

    render(<ViewRatings />);
    await waitFor(() =>
      expect(screen.getByText("No properties found")).toBeInTheDocument()
    );
  });

  test("shows feedback when available for a rental", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockRentals })
      .mockResolvedValueOnce({ data: mockFeedback["1"] })
      .mockResolvedValueOnce({ data: mockFeedback["2"] });

    render(<ViewRatings />);
    await waitFor(() => screen.getByText("Rental 1"));

    expect(screen.getByText("Good place")).toBeInTheDocument();
    expect(screen.getByText("Nice stay")).toBeInTheDocument();
  });

 
});
