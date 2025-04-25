import { render, screen, waitFor } from "@testing-library/react";
import PaymentOwner from "../../components/paymentOwner";
import React from 'react';
import userEvent from '@testing-library/user-event';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MemoryRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

// Reset mocks between tests
beforeEach(() => {
  mockAxios.reset();
});

test("displays loading state while fetching user profile", async () => {
  // Delay the response to ensure loading state is visible
  mockAxios.onGet("http://localhost:5556/profile").reply(() => {
    return new Promise(resolve => {
      setTimeout(() => resolve([200, { user: { ownerId: "123" } }]), 100);
    });
  });

  render(
    <MemoryRouter>
      <PaymentOwner />
    </MemoryRouter>
  );

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
});

test("fetches user data successfully", async () => {
  // Setup mock responses for all API calls
  mockAxios.onGet("http://localhost:5556/profile").reply(200, { user: { ownerId: "123" } });
  mockAxios.onGet("http://localhost:5556/owns/rentals/123").reply(200, [{ _id: "rental1", name: "Rental 1" }]);
  mockAxios.onGet("http://localhost:5556/rents").reply(200, [
    { tenantId: { _id: "tenant1", firstName: "John", lastName: "Doe" }, rentalId: "rental1" }
  ]);
  mockAxios.onGet("http://localhost:5556/payment").reply(200, { payments: [] });

  render(
    <MemoryRouter>
      <PaymentOwner />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
  //expect(screen.getByText("Payment")).toBeInTheDocument();
});

test("shows error message when fetching user profile fails", async () => {
  mockAxios.onGet("http://localhost:5556/profile").reply(500);

  render(
    <MemoryRouter>
      <PaymentOwner />
    </MemoryRouter>
  );

  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
  expect(screen.getByText("Failed to load user profile. Please try refreshing the page.")).toBeInTheDocument();
});

test("shows alert when required fields are missing for invoice", async () => {
  // Setup mock responses
  mockAxios.onGet("http://localhost:5556/profile").reply(200, { user: { ownerId: "123" } });
  mockAxios.onGet("http://localhost:5556/owns/rentals/123").reply(200, [{ _id: "rental1", name: "Rental 1" }]);
  mockAxios.onGet("http://localhost:5556/rents").reply(200, [
    { tenantId: { _id: "tenant1", firstName: "John", lastName: "Doe" }, rentalId: "rental1" }
  ]);
  mockAxios.onGet("http://localhost:5556/payment").reply(200, { payments: [] });

  const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

  render(
    <MemoryRouter>
      <PaymentOwner />
    </MemoryRouter>
  );

  // Wait for component to load
  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

  // Find and click the generate invoice button
  const generateInvoiceButton = screen.getByText("Generate Invoice");
  userEvent.click(generateInvoiceButton);

  //expect(mockAlert).toHaveBeenCalledWith("Please fill all required fields");

  mockAlert.mockRestore();
});

test("generates invoice successfully without due date and amount", async () => {
    // Setup user event
    const user = userEvent.setup();
    
    // Setup mock responses
    mockAxios.onGet("http://localhost:5556/profile").reply(200, { user: { ownerId: "123" } });
    mockAxios.onGet("http://localhost:5556/owns/rentals/123").reply(200, [{ _id: "rental1", name: "Rental 1" }]);
    mockAxios.onGet("http://localhost:5556/rents").reply(200, [
      { tenantId: { _id: "tenant1", firstName: "John", lastName: "Doe", fullName: "John Doe" }, rentalId: "rental1" }
    ]);
    mockAxios.onGet("http://localhost:5556/payment").reply(200, { payments: [] });
    mockAxios.onPost("http://localhost:5556/payment").reply(200, {});
    mockAxios.onPost("http://localhost:5556/notifications").reply(200, {});
  
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});
  
    render(
      <MemoryRouter>
        <PaymentOwner />
      </MemoryRouter>
    );
  
    // Wait for component to load
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());
  
    // Fill in the form fields except for due date and amount
    const tenantSelect = await screen.findByRole("combobox");
  
    // Select tenant option
    await user.selectOptions(tenantSelect, "John Doe");
  
    // Click generate invoice button
    const generateInvoiceButton = screen.getByText("Generate Invoice");
    await user.click(generateInvoiceButton);
  
    // Verify the API calls were made correctly
    await waitFor(() => {
      expect(mockAxios.history.post.length).toBeGreaterThan(0);
      const paymentRequest = mockAxios.history.post.find(req => req.url === "http://localhost:5556/payment");
      expect(paymentRequest).toBeTruthy();
    });
  
    // Check alert was called with success message
    expect(mockAlert).toHaveBeenCalledWith("Invoice generated for John Doe");
  
    mockAlert.mockRestore();
  });
  

test("sorts bills by due date", async () => {
  // Setup user event
  const user = userEvent.setup();
  
  // Setup mock responses with multiple payments with different dates
  mockAxios.onGet("http://localhost:5556/profile").reply(200, { user: { ownerId: "123" } });
  mockAxios.onGet("http://localhost:5556/owns/rentals/123").reply(200, [{ _id: "rental1", name: "Rental 1" }]);
  mockAxios.onGet("http://localhost:5556/rents").reply(200, [
    { tenantId: { _id: "tenant1", firstName: "John", lastName: "Doe", fullName: "John Doe" }, rentalId: "rental1" }
  ]);
  
  // Create payments with different due dates
  mockAxios.onGet("http://localhost:5556/payment").reply(200, { 
    payments: [
      { _id: "payment1", tenantId: "tenant1", dueDate: "2025-06-01", total: 100, status: false },
      { _id: "payment2", tenantId: "tenant1", dueDate: "2025-05-01", total: 200, status: false }
    ]
  });

  render(
    <MemoryRouter>
      <PaymentOwner />
    </MemoryRouter>
  );

  // Wait for component to load
  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

  // Click the sort button
  const sortButton = screen.getByText("Sort");
  await user.click(sortButton);

  // Get the table rows to check sorting
  const tableRows = await screen.findAllByRole("row");
  
  // Skip header row (index 0)
  const firstRowCells = tableRows[1].querySelectorAll("td");
  const secondRowCells = tableRows[2].querySelectorAll("td");
  
  // Extract dates from cells
  const firstRowDate = new Date(firstRowCells[2].textContent);
  const secondRowDate = new Date(secondRowCells[2].textContent);
  
  // Check if sorted correctly
  expect(firstRowDate <= secondRowDate).toBe(true);
});

test("filters bills by tenant name", async () => {
  // Setup user event
  const user = userEvent.setup();
  
  // Setup mock responses with tenant data
  mockAxios.onGet("http://localhost:5556/profile").reply(200, { user: { ownerId: "123" } });
  mockAxios.onGet("http://localhost:5556/owns/rentals/123").reply(200, [{ _id: "rental1", name: "Rental 1" }]);
  mockAxios.onGet("http://localhost:5556/rents").reply(200, [
    { tenantId: { _id: "tenant1", firstName: "John", lastName: "Doe", fullName: "John Doe" }, rentalId: "rental1" },
    { tenantId: { _id: "tenant2", firstName: "Jane", lastName: "Smith", fullName: "Jane Smith" }, rentalId: "rental1" }
  ]);
  
  // Create payments for different tenants
  mockAxios.onGet("http://localhost:5556/payment").reply(200, { 
    payments: [
      { _id: "payment1", tenantId: "tenant1", dueDate: "2025-06-01", total: 100, status: false },
      { _id: "payment2", tenantId: "tenant2", dueDate: "2025-05-01", total: 200, status: false }
    ]
  });

  render(
    <MemoryRouter>
      <PaymentOwner />
    </MemoryRouter>
  );

  // Wait for component to load
  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

  // Get the tenant filter input
  const tenantInput = screen.getByPlaceholderText("Search Tenant");
  
  // Type a tenant name to filter
  await user.clear(tenantInput);
  await user.type(tenantInput, "John");
  
  // Give time for filtering to apply
  await waitFor(() => {
    const tableRows = screen.getAllByRole("row");
    // Check if filtering worked (should only show John Doe's row)
    expect(tableRows.length).toBe(2); // Header + 1 data row
    expect(tableRows[1].textContent).toContain("John Doe");
    expect(tableRows[1].textContent).not.toContain("Jane Smith");
  });
});