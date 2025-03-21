import express from "express";
import { Owner } from "../models/ownerModel.js";
import { Owns } from "../models/ownsModel.js";
import { Rental } from "../models/rentalModel.js";
import mongoose from "mongoose";
const router = express.Router();

// Create a new ownership record
router.post("/", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body); // Debugging line

    const { ownerId, rentalId } = req.body;

    if (!ownerId || !rentalId) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Convert IDs to ObjectId
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const rentalObjectId = new mongoose.Types.ObjectId(rentalId);

    const owner = await Owner.findById(ownerObjectId);
    const rental = await Rental.findById(rentalObjectId);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const newOwns = new Owns({
      ownerId: ownerObjectId,
      rentalId: rentalObjectId,
    });

    await newOwns.save();

    return res.status(201).json({
      message: "Ownership record created successfully!",
      data: newOwns,
    });
  } catch (err) {
    console.error("Error in POST /owns:", err); // Debugging line
    return res.status(500).json({ message: err.message });
  }
});

// Get all ownership records
router.get("/", async (req, res) => {
  try {
    const owns = await Owns.find()
      .populate("ownerId", "firstName lastName email") // Use correct field names
      .populate("rentalId", "rentalName address"); // Ensure rentalModel has these fields

    return res.status(200).json(owns);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
