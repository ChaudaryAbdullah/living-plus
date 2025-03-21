import express from "express";
import { Rent } from "../models/rentModel.js";
import mongoose from "mongoose";
const router = express.Router();

// Get all rents (for admin or debugging)
router.get("/", async (req, res) => {
  try {
    const rents = await Rent.find();
    res.json(rents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get rentals where the user is a tenant
router.get("/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Log tenantId received in request
    console.log("Received tenantId:", tenantId);

    // Check if tenantId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ message: "Invalid tenant ID format" });
    }

    // Convert tenantId to ObjectId
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

    const userRents = await Rent.find({ tenantId: tenantObjectId }).populate(
      "rentalId"
    );

    // Log the fetched data
    console.log("Fetched user rents:", JSON.stringify(userRents, null, 2));

    if (userRents.length === 0) {
      return res
        .status(404)
        .json({ message: "No rentals found for this tenant" });
    }

    res.json(userRents.map((rent) => rent.rentalId));
  } catch (error) {
    console.error("Error fetching user rentals:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
