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

router.get("/rentals/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid ownerId format" });
    }

    const userRents = await Owns.find({ ownerId })
      .populate("rentalId") // Populating rental details
      .exec();

    console.log("Fetched user rents:", userRents);

    if (!userRents.length) {
      return res
        .status(404)
        .json({ message: "No rentals found for this owner." });
    }

    // Return only the rental details
    res.json(userRents.map((rent) => rent.rentalId));
  } catch (err) {
    console.error("Error in GET /rentals/:ownerId:", err);
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:rentalId", async (req, res) => {
  try {
    const { rentalId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(rentalId)) {
      return res.status(400).json({ message: "Invalid rentalId format" });
    }

    const userRents = await Owns.find({ rentalId }).populate("ownerId").exec();

    console.log("Fetched user owns:", userRents);

    if (!userRents.length) {
      return res
        .status(404)
        .json({ message: "No Owner found for this rental." });
    }

    // Return only the rental details
    res.json(userRents.map((owns) => owns.ownerId));
  } catch (err) {
    console.error("Error in GET /:rentalId:", err);
    return res.status(500).json({ message: err.message });
  }
});

router.get("/norentals/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid ownerId format" });
    }

    // Fetch all rentals that DO belong to this owner
    const ownedRentals = await Owns.find({ ownerId }).distinct("rentalId");

    // Fetch rentals that are NOT in the ownedRentals list
    const unownedRentals = await Rental.find({ _id: { $nin: ownedRentals } });

    console.log("Fetched unowned rentals:", unownedRentals);

    if (!unownedRentals.length) {
      return res
        .status(404)
        .json({ message: "No rentals found for this user." });
    }

    res.json(unownedRentals);
  } catch (err) {
    console.error("Error in GET /rentals/:ownerId:", err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
