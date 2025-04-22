import express from "express";
import mongoose from "mongoose";
import { Rent } from "../models/rentModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { amount, roomId, tenantId, rentalId } = req.body;

    if (!amount || !roomId || !tenantId || !rentalId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRent = new Rent({
      amount,
      roomId: new mongoose.Types.ObjectId(roomId),
      tenantId: new mongoose.Types.ObjectId(tenantId),
      rentalId: new mongoose.Types.ObjectId(rentalId),
    });

    const savedRent = await newRent.save();
    res.status(201).json(savedRent);
  } catch (error) {
    console.error("Error creating rent:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const rents = await Rent.find()
      .populate("rentalId")
      .populate("tenantId")
      //.exec();

    res.status(200).json(rents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;
    console.log("Received tenantId:", tenantId);

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    // Find rents where the tenant is the given user
    const userRents = await Rent.find({ tenantId: tenantId })
      .populate("rentalId")
      .populate("roomId") // Populating rental details
      .exec();

    console.log("Fetched user rents:", userRents);

    // Return only the rental details
    res.json(userRents.map((rent) => rent));
  } catch (error) {
    console.error("Error fetching user rents:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// router.get("/rents/:tenantId", async (req, res) => {
//   const { tenantId } = req.params;
//   const rentals = await RentalModel.find({ tenantId }); // Adjust as per your database schema
//   if (!rentals) {
//     return res.status(404).json({ error: "Rentals not found" });
//   }
//   res.json(rentals);
// });

export default router;
