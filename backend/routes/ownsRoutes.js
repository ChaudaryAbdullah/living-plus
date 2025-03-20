import express from "express";
import { Owner } from "../models/ownerModel.js";
import { Owns } from "../models/ownsModel.js";
import { Rental } from "../models/rentalModel.js";
import mongoose from "mongoose";
const router = express.Router();

// Create a new ownership record
router.post("/", async (req, res) => {
  try {
    const { ownerId, rentalId } = req.body;

    if (!ownerId || !rentalId) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    // Convert string IDs to ObjectId
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    const rentalObjectId = new mongoose.Types.ObjectId(rentalId);

    console.log(ownerObjectId, rentalObjectId);
    const owner = await Owner.findById(ownerId);
    const rental = await Rental.findById(rentalId);

    if (!owner || !rental) {
      return res.status(404).send({ message: "Owner or rental not found" });
    }

    const newOwns = new Owns({
      ownerId: ownerId,
      rentalId: rentalId,
    });

    await newOwns.save();
    return res.status(201).send({
      message: "Ownership record created successfully!",
      data: newOwns,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get all ownership records
router.get("/", async (req, res) => {
  try {
    const owns = await Owns.find()
      .populate("ownerId", "name email") // Populating owner details
      .populate("rentalId", "rentalName address"); // Populating rental details
    return res.status(200).json(owns);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
