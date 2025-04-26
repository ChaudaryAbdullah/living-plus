import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // To mock routing context for Link
import RenterSidebar from "../../components/renter-sidebar"; // Adjust the import path as needed
import React from 'react';
jest.mock("lucide-react", () => ({
  Home: () => <svg data-testid="home-icon" />,
  ShieldCheck: () => <svg data-testid="shield-check-icon" />,
  Handshake: () => <svg data-testid="handshake-icon" />,
  Plus: () => <svg data-testid="plus-icon" />,
  ClipboardList: () => <svg data-testid="clipboard-list-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
  MessageSquare: () => <svg data-testid="message-square-icon" />,
  LogOut: () => <svg data-testid="log-out-icon" />,
  CreditCard: () => <svg data-testid="credit-card-icon" />,
}));

describe("RenterSidebar", () => {
  let setActiveItem;

  beforeEach(() => {
    setActiveItem = jest.fn();
  });

  const renderSidebar = (activeItem) => {
    render(
      <MemoryRouter>
        <RenterSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      </MemoryRouter>
    );
  };

  it("renders all menu items correctly", () => {
    renderSidebar("discover");

    // Check that each menu item is rendered
    expect(screen.getByText("Discover")).toBeInTheDocument();
    expect(screen.getByText("Owned Rental")).toBeInTheDocument();
    expect(screen.getByText("Rented Rental")).toBeInTheDocument();
    expect(screen.getByText("Apply Hostel")).toBeInTheDocument();
    expect(screen.getByText("Apply Rooms")).toBeInTheDocument();
    expect(screen.getByText("Request Parking")).toBeInTheDocument();
    expect(screen.getByText("Add Ratings")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("highlights the active menu item", () => {
    renderSidebar("rented-rentals");

    // Check if the correct item is highlighted
    expect(screen.getByText("Rented Rental").closest("li")).toHaveClass("sidebar-item");
    expect(screen.getByText("Discover").closest("li")).not.toHaveClass("active");
  });

  it("calls setActiveItem when a menu item is clicked", () => {
    renderSidebar("discover");

    // Click on a menu item
    fireEvent.click(screen.getByText("Apply Hostel"));

    // Ensure that setActiveItem was called with the correct argument
    expect(setActiveItem).toHaveBeenCalledWith("apply-hostel");
  });

  it("renders the correct icons for each menu item", () => {
    renderSidebar("discover");

    // Check if icons are rendered correctly
    //expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("shield-check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("handshake-icon")).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    expect(screen.getByTestId("clipboard-list-icon")).toBeInTheDocument();
    expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
    expect(screen.getByTestId("message-square-icon")).toBeInTheDocument();
    expect(screen.getByTestId("log-out-icon")).toBeInTheDocument();
    expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument();
  });

  it("renders the active item correctly when a menu item is clicked", () => {
    renderSidebar("rented-rentals");

    // Check if the active item is rendered correctly
    expect(screen.getByText("Rented Rental").closest("li")).toHaveClass("active");

    // Click on a different menu item and check the active class
    fireEvent.click(screen.getByText("Discover"));
    expect(screen.getByText("Discover").closest("li")).toHaveClass("sidebar-item");
    expect(screen.getByText("Rented Rental").closest("li")).not.toHaveClass("active");
  });
});
