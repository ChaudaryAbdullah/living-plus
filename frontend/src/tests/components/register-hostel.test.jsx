import React from "react";
import {MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HostelRegistrationForm from "../../components/register-hostel"; // Adjust path as needed

describe("HostelRegistrationForm", () => {
  it("renders the form with default values", () => {
    render(    <MemoryRouter>
      <HostelRegistrationForm />
    </MemoryRouter>);

    // Check that the form inputs are rendered correctly
    expect(screen.getByLabelText("Hostel Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Amenities")).toBeInTheDocument();
    expect(screen.getByLabelText("Capacity")).toBeInTheDocument();
    expect(screen.getByLabelText("Available Rooms")).toBeInTheDocument();
  });

  it("allows the user to input data into the form fields", () => {
    render(    <MemoryRouter>
      <HostelRegistrationForm />
    </MemoryRouter>);

    // Find input fields and simulate user typing
    fireEvent.change(screen.getByLabelText("Hostel Name"), {
      target: { value: "New Hostel" },
    });
    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "123 Street Name" },
    });
    fireEvent.change(screen.getByLabelText("Amenities"), {
      target: { value: "Wi-Fi, Gym" },
    });
    fireEvent.change(screen.getByLabelText("Capacity"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("Available Rooms"), {
      target: { value: "50" },
    });

    // Check that the values are updated in the formData state
    expect(screen.getByLabelText("Hostel Name").value).toBe("New Hostel");
    expect(screen.getByLabelText("Address").value).toBe("123 Street Name");
    expect(screen.getByLabelText("Amenities").value).toBe("Wi-Fi, Gym");
    expect(screen.getByLabelText("Capacity").value).toBe("100");
    expect(screen.getByLabelText("Available Rooms").value).toBe("50");
  });

  it("submits the form with the correct data", async () => {
    const mockSubmit = jest.fn();
    const { getByText, getByLabelText } = render(    <MemoryRouter>
      <HostelRegistrationForm />
    </MemoryRouter>);

    fireEvent.change(getByLabelText("Hostel Name"), {
      target: { value: "Test Hostel" },
    });
    fireEvent.change(getByLabelText("Address"), {
      target: { value: "456 Test Address" },
    });
    fireEvent.change(getByLabelText("Amenities"), {
      target: { value: "Parking, Laundry" },
    });
    fireEvent.change(getByLabelText("Capacity"), {
      target: { value: "200" },
    });
    fireEvent.change(getByLabelText("Available Rooms"), {
      target: { value: "150" },
    });

    fireEvent.submit(getByText("Apply"));

    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(0));
    expect(mockSubmit).toHaveBeenCalledWith({
      hostelName: "Test Hostel",
      address: "456 Test Address",
      amenities: "Parking, Laundry",
      capacity: "200",
      availableRooms: "150",
    });
  });

  it("displays the footer, sidebar, and header correctly", () => {
    render(    <MemoryRouter>
      <HostelRegistrationForm />
    </MemoryRouter>);

    // These elements will now render normally if they are included in the component
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});
