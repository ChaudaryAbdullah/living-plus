// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import AddRooms from "../../components/AddRooms";
// import axios from "axios";
// import { BrowserRouter } from "react-router-dom";

// // Mock axios
// jest.mock("axios");

// const renderComponent = () =>
//   render(
//     <BrowserRouter>
//       <AddRooms />
//     </BrowserRouter>
//   );

// describe("AddRooms Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//   beforeAll(() => {
//     jest.spyOn(console, "error").mockImplementation((msg) => {
//       if (
//         typeof msg === "string" &&
//         msg.includes("Error fetching user profile")
//       ) {
//         return; // Ignore this known error
//       }
//       console.error(msg);
//     });
//   });
  

//   test("displays loading state initially", async () => {
//     axios.get.mockRejectedValueOnce(new Error("Profile fetch error"));

//     renderComponent();

//     expect(screen.getByText(/loading/i)).toBeInTheDocument();
//   });

//   test("fetches and displays rental options", async () => {
//     // First call: user profile
//     axios.get.mockResolvedValueOnce({
//       data: { user: { ownerId: "owner123" } },
//     });

//     // Second call: rentals for the user
//     axios.get.mockResolvedValueOnce({
//       data: [
//         { _id: "1", rentalName: "Rental A" },
//         { _id: "2", rentalName: "Rental B" },
//       ],
//     });

//     renderComponent();

//     await waitFor(() => {
//       expect(screen.getByText("Rental A")).toBeInTheDocument();
//       expect(screen.getByText("Rental B")).toBeInTheDocument();
//     });
//   });

//   test("shows error message if rentals fail to load", async () => {
//     // Profile loads successfully
//     axios.get.mockResolvedValueOnce({
//       data: { user: { ownerId: "owner123" } },
//     });

//     // Rentals fetch fails
//     axios.get.mockRejectedValueOnce(new Error("Failed to load rentals"));

//     renderComponent();

//     await waitFor(() => {
//       expect(
//         screen.getByText(/Failed to load your rentals/i)
//       ).toBeInTheDocument();
//     });
//   });

//   test("allows form input and submits successfully", async () => {
//     // Mock user and rentals
//     axios.get.mockResolvedValueOnce({
//       data: { user: { ownerId: "owner123" } },
//     });
//     axios.get.mockResolvedValueOnce({
//       data: [{ _id: "1", rentalName: "Rental A" }],
//     });

//     // Mock successful room addition
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ message: "Room added successfully!" }),
//       })
//     );

//     renderComponent();

//     await waitFor(() => screen.getByText("Rental A"));

//     fireEvent.change(screen.getByLabelText(/select rental/i), {
//       target: { value: "1" },
//     });
//     fireEvent.change(screen.getByLabelText(/room type/i), {
//       target: { value: "single" },
//     });
//     fireEvent.change(screen.getByLabelText(/description/i), {
//       target: { value: "Nice room with AC" },
//     });
//     fireEvent.change(screen.getByLabelText(/price/i), {
//       target: { value: "500" },
//     });
//     fireEvent.change(screen.getByLabelText(/room picture/i), {
//       target: { value: "http://example.com/pic.jpg" },
//     });

//     fireEvent.click(screen.getByText(/add room/i));

//     await waitFor(() =>
//       expect(
//         screen.getByText(/Room added successfully!/i)
//       ).toBeInTheDocument()
//     );
//   });

//   test("shows error message on room submission failure", async () => {
//     // Mock user and rentals
//     axios.get.mockResolvedValueOnce({
//       data: { user: { ownerId: "owner123" } },
//     });
//     axios.get.mockResolvedValueOnce({
//       data: [{ _id: "1", rentalName: "Rental A" }],
//     });

//     // Mock failed submission
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         ok: false,
//         json: () => Promise.resolve({ message: "Failed to add room!" }),
//       })
//     );

//     renderComponent();

//     await waitFor(() => screen.getByText("Rental A"));

//     fireEvent.change(screen.getByLabelText(/select rental/i), {
//       target: { value: "1" },
//     });
//     fireEvent.change(screen.getByLabelText(/room type/i), {
//       target: { value: "single" },
//     });
//     fireEvent.change(screen.getByLabelText(/description/i), {
//       target: { value: "Some room description" },
//     });
//     fireEvent.change(screen.getByLabelText(/price/i), {
//       target: { value: "500" },
//     });
//     fireEvent.change(screen.getByLabelText(/room picture/i), {
//       target: { value: "http://example.com/pic.jpg" },
//     });

//     fireEvent.click(screen.getByText(/add room/i));

//     await waitFor(() =>
//       expect(screen.getByText(/Failed to add room!/i)).toBeInTheDocument()
//     );
//   });
// });
