import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index.js'; // Make sure this is the path to your app's entry point
import { Applicant } from '../../models/applicantModel.js';

// You can use a separate test DB URI here if needed
// beforeAll(async () => {
//   await mongoose.connect("mongodb://localhost:27017/Living_Plus_Test", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// });

// afterAll(async () => {
//   // Clear test data (optional)
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
// });

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
