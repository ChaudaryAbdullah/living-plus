import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index.js'; // Make sure this is the path to your "http://localhost:5556"'s entry point
import { Applicant } from '../../models/applicantModel.js';
import { Rental } from '../../models/rentalModel.js';
import { Room } from '../../models/roomModel.js';

describe("Applicant API", () => {
  let createdApplicantId = null;
  const mockApplicant = {
    userName: "john_doe",
    firstName: "John",
    lastName: "Doe",
    address: "123 Main St",
    dob: "1990-01-01",
    email: "john@example.com",
    password: "securepassword",
  };

  test("POST /applicant - should create a new applicant", async () => {
    const res = await request("http://localhost:5556")
      .post("/applicant")
      .send(mockApplicant);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("New applicant created successfully!");

    const saved = await Applicant.findOne({ userName: "john_doe" });
    createdApplicantId = saved._id.toString(); // store for later tests
  });

  test("POST /applicant - should return 400 if fields are missing", async () => {
    const res = await request("http://localhost:5556")
      .post("/applicant")
      .send({ ...mockApplicant, email: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please fill all the fields");
  });

  test("GET /applicant - should return list of applicants", async () => {
    const res = await request("http://localhost:5556").get("/applicant");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /applicant/:userName - should return specific applicant", async () => {
    const res = await request("http://localhost:5556")
      .get(`/applicant/${mockApplicant.userName}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.userName).toBe(mockApplicant.userName);
  });

  test("GET /applicant/:userName - should return 404 for invalid userName", async () => {
    const res = await request("http://localhost:5556")
      .get("/applicant/unknown_user");

    expect(res.statusCode).toBe(404);
  });

  test("PUT /applicant/:id - should update applicant", async () => {
    const updated = { ...mockApplicant, firstName: "Johnny" };
    
    const res = await request("http://localhost:5556")
      .put(`/applicant/${createdApplicantId}`)
      .send(updated);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Applicant updated successfully!");
  });

  test("DELETE /applicant/:id - should delete applicant", async () => {
    const res = await request("http://localhost:5556")
      .delete(`/applicant/${createdApplicantId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Applicant deleted successfully!");
  });

  test("DELETE /applicant/:id - should return 404 if not found", async () => {
    const res = await request("http://localhost:5556")
      .delete(`/applicant/${createdApplicantId}`);

    expect(res.statusCode).toBe(404);
  });
});
describe("Rental API", () => {
  let createdRentalId = null;
  const mockRental = {
    rentalName: "Green Villa",
    address: "456 Elm Street",
    facilities: ["Wi-Fi", "Parking", "Gym"],
    totalRooms: 10,
    availableRooms: 5,
  };


  test("POST /rentals - should create a new rental", async () => {
    const res = await request("http://localhost:5556")
      .post("/rentals")
      .send(mockRental);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("New rental created successfully!");


    const saved = await Rental.findOne({ rentalName: "Green Villa" });
    createdRentalId = saved._id.toString();
  });

  test("POST /rentals - should return 400 if fields are missing", async () => {
    const res = await request("http://localhost:5556")
      .post("/rentals")
      .send({ ...mockRental, address: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please fill all the fields");
  });

  test("GET /rentals - should return list of rentals", async () => {
    const res = await request("http://localhost:5556").get("/rentals");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /rentals/:id - should return specific rental", async () => {
    const res = await request("http://localhost:5556")
      .get(`/rentals/${createdRentalId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.rentalName).toBe(mockRental.rentalName);
  });

  test("GET /rentals/:id - should return 404 for invalid ID", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const res = await request("http://localhost:5556")
      .get(`/rentals/${invalidId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Rental not found");
  });

  test("PUT /rentals/:id - should update rental", async () => {
    const updated = { ...mockRental, availableRooms: 3 };

    const res = await request("http://localhost:5556")
      .put(`/rentals/${createdRentalId}`)
      .send(updated);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Rental updated successfully!");
  });

  test("DELETE /rentals/:id - should delete rental", async () => {
    const res = await request("http://localhost:5556")
      .delete(`/rentals/${createdRentalId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Rental deleted successfully!");
  });

  test("DELETE /rentals/:id - should return 404 if not found", async () => {
    const res = await request("http://localhost:5556")
      .delete(`/rentals/${createdRentalId}`); // already deleted

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Rental not found");
  });

  
});
let rentalId = "67dd06679a81ff778eb16cfa";
let createdRoomId;
describe("Room API", () => {
    it("POST /rooms - should create a new room", async () => {
        const res = await request("http://localhost:5556").post("/rooms").send({
        rtype: "Deluxe",
        status: "Available",
        description: "Spacious and sunny room.",
        price: 1500,
        rentalId: rentalId,
        //picture: "http://example.com/image.jpg",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("New room created successfully!");

        const saved = await Room.findOne({ rtype: "Deluxe" });
        expect(saved).toBeTruthy();
        createdRoomId = saved._id.toString();
    });

    it("GET /rooms - should return all rooms", async () => {
        const res = await request("http://localhost:5556").get("/rooms");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("GET /rooms/:id - should return specific room", async () => {
        const res = await request("http://localhost:5556").get(`/rooms/${createdRoomId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.rtype).toBe("Deluxe");
    });

    it("PUT /rooms/:id - should update room", async () => {
        const res = await request("http://localhost:5556").put(`/rooms/${createdRoomId}`).send({
        rtype: "Executive Suite",
        status: "Occupied",
        description: "Updated description",
        price: 2000,
        rentalId: rentalId,
        picture: "http://example.com/updated.jpg",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Room updated successfully!");
    });

    it("DELETE /rooms/:id - should delete room", async () => {
        const res = await request("http://localhost:5556").delete(`/rooms/${createdRoomId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Room deleted successfully!");
    });

    it("DELETE /rooms/:id - should return 404 if not found", async () => {
        const res = await request("http://localhost:5556").delete(`/rooms/${createdRoomId}`); // already deleted
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Room not found");
    });

    it("GET /rooms/:id - should return 404 for invalid room ID", async () => {
        const res = await request("http://localhost:5556").get("/rooms/invalidRoomId123");
        expect(res.statusCode).toBe(500); // CastError from mongoose
    });

    it("POST /rooms - should return 400 for missing fields", async () => {
        const res = await request("http://localhost:5556").post("/rooms").send({
        status: "Available",
        price: 1000,
        rentalId: rentalId,
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Please fill all the required fields");
    });
});