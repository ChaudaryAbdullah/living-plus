import express from "express";
import { Rent } from "../models/rentModel.js";

const router = express.Router();

// Get all rents (for admin or debugging)
router.get("/", async (req, res) => {
  try {
    const rents = await Rent.find().populate("roomId tenantId rentalId");
    res.json(rents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get rentals where the user is a tenant
router.get("/user/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;
    const userRents = await Rent.find({ tenantId }).populate("rentalId");
    res.json(userRents.map((rent) => rent.rentalId)); // Return only the rental info
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
