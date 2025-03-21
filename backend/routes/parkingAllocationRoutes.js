import { ParkingAllocation } from "../models/parkingAllocationModel.js";
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { slotId, tenantId } = req.body;

    const newAllocation = new ParkingAllocation({ slotId, tenantId });
    await newAllocation.save();

    res.status(201).json(newAllocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all parking allocations
router.get("/", async (req, res) => {
  try {
    const allocations = await ParkingAllocation.find()
      .populate("slotId")
      .populate("tenantId");

    res.status(200).json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific parking allocation by ID
router.get("/:id", async (req, res) => {
  try {
    const allocation = await ParkingAllocation.findById(req.params.id)
      .populate("slotId")
      .populate("tenantId");

    if (!allocation) {
      return res.status(404).json({ message: "Parking allocation not found" });
    }

    res.status(200).json(allocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a parking allocation
router.put("/:id", async (req, res) => {
  try {
    const { slotId, tenantId } = req.body;
    const updatedAllocation = await ParkingAllocation.findByIdAndUpdate(
      req.params.id,
      { slotId, tenantId },
      { new: true }
    );

    if (!updatedAllocation) {
      return res.status(404).json({ message: "Parking allocation not found" });
    }

    res.status(200).json(updatedAllocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a parking allocation
router.delete("/:id", async (req, res) => {
  try {
    const deletedAllocation = await ParkingAllocation.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAllocation) {
      return res.status(404).json({ message: "Parking allocation not found" });
    }

    res
      .status(200)
      .json({ message: "Parking allocation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
