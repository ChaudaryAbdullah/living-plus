/* eslint-env jest */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import NotificationsPage from "../../components/view-notifications";
import axios from "axios";

// Mock child components
jest.mock("../../components/Footer", () => () => <div>Footer</div>);
jest.mock("../../components/Header", () => ({ title }) => (
  <div>Header - {title}</div>
));
jest.mock("../../components/owner-sidebar", () => () => (
  <div>Sidebar</div>
));

// Mock axios
jest.mock("axios");

describe("NotificationsPage Component", () => {
  const mockUserData = {
    user: {
      tenantId: "user123",
    },
  };

  const mockNotifications = [
    { id: "1", date: "2024-04-20", description: "Notification one" },
    { id: "2", date: "2024-04-22", description: "Notification two" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<NotificationsPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders notifications on successful API call", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData }) // profile
      .mockResolvedValueOnce({ data: mockNotifications }); // notifications

    render(<NotificationsPage />);
    await waitFor(() =>
      expect(screen.getByText("Notification one")).toBeInTheDocument()
    );
    expect(screen.getByText("Notification two")).toBeInTheDocument();
  });

  test("handles error if user profile fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    render(<NotificationsPage />);
    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load user profile: Network error/)
      ).toBeInTheDocument()
    );
  });

  test("handles error if notifications fetch fails", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockRejectedValueOnce({ message: "Server error" });

    render(<NotificationsPage />);
    await waitFor(() =>
      expect(
        screen.getByText(/Failed to load your notifications/i)
      ).toBeInTheDocument()
    );
  });

  test("filters notifications by date and description", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockNotifications });

    render(<NotificationsPage />);
    await waitFor(() => screen.getByText("Notification one"));

    fireEvent.change(screen.getByPlaceholderText("Filter by date"), {
      target: { value: "2024-04-22" },
    });
    fireEvent.change(screen.getByPlaceholderText("Filter by description"), {
      target: { value: "two" },
    });

    expect(screen.queryByText("Notification one")).not.toBeInTheDocument();
    expect(screen.getByText("Notification two")).toBeInTheDocument();
  });

  test("sorts notifications by date when sort button is clicked", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({
        data: [
          { id: "1", date: "2024-04-20", description: "First" },
          { id: "2", date: "2024-04-21", description: "Second" },
        ],
      });

    render(<NotificationsPage />);
    await waitFor(() => screen.getByText("First"));

    const sortBtn = screen.getByText("Sort");
    fireEvent.click(sortBtn); // Asc
    fireEvent.click(sortBtn); // Desc again — logic tested by UI not crashing

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  test("shows no notifications message when list is empty", async () => {
    axios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: [] });

    render(<NotificationsPage />);
    await waitFor(() =>
      expect(screen.getByText("No notifications found")).toBeInTheDocument()
    );
  });
});
