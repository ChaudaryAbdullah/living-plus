import express from "express";
import { ParkingSlot } from "../models/parkingSlotModel.js";
const router = express.Router();

// Create a new parking slot
router.post("/", async (req, res) => {
  try {
    const { isOccupied, rentalId } = req.body;
    if (isOccupied === undefined || !rentalId) {
      return res.status(400).send({ message: "Please fill all the required fields" });
    }

    const newParkingSlot = new ParkingSlot({ isOccupied, rentalId });
    await newParkingSlot.save();
    return res.status(201).send({ message: "New parking slot created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get all parking slots
router.get("/", async (req, res) => {
  try {
    const parkingSlots = await ParkingSlot.find();
    return res.status(200).send(parkingSlots);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get a parking slot by ID
router.get("/:id", async (req, res) => {
  try {
    const parkingSlot = await ParkingSlot.findById(req.params.id);
    if (!parkingSlot) {
      return res.status(404).send({ message: "Parking slot not found" });
    }
    return res.status(200).send(parkingSlot);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Update a parking slot by ID
router.put("/:id", async (req, res) => {
  try {
    const { isOccupied, rentalId } = req.body;
    if (isOccupied === undefined || !rentalId) {
      return res.status(400).send({ message: "Please fill all the required fields" });
    }

    const parkingSlot = await ParkingSlot.findById(req.params.id);
    if (!parkingSlot) {
      return res.status(404).send({ message: "Parking slot not found" });
    }
    
    parkingSlot.isOccupied = isOccupied;
    parkingSlot.rentalId = rentalId;
    await parkingSlot.save();
    
    return res.status(200).send({ message: "Parking slot updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Delete a parking slot by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const parkingSlot = await ParkingSlot.findByIdAndDelete(id);
    if (!parkingSlot) {
      return res.status(404).send({ message: "Parking slot not found" });
    }
    return res.status(200).send({ message: "Parking slot deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
