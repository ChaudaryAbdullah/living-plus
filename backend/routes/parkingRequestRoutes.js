import { ParkingRequest } from "../models/parkingRequestModel.js";
import express from "express";
const router = express.Router();

// Create a new parking request
router.post("/", async (req, res) => {
  try {
    const { slotId, tenantId } = req.body;

    const newRequest = new ParkingRequest({ slotId, tenantId });
    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all parking requests
router.get("/", async (req, res) => {
  try {
    const requests = await ParkingRequest.find()
      .populate("slotId")
      .populate("tenantId");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific parking request by ID
router.get("/:id", async (req, res) => {
  try {
    const request = await ParkingRequest.findById(req.params.id)
      .populate("slotId")
      .populate("tenantId");

    if (!request) {
      return res.status(404).json({ message: "Parking request not found" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a parking request
router.put("/:id", async (req, res) => {
  try {
    const { slotId, tenantId } = req.body;
    const updatedRequest = await ParkingRequest.findByIdAndUpdate(
      req.params.id,
      { slotId, tenantId },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Parking request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a parking request
router.delete("/:id", async (req, res) => {
  try {
    const deletedRequest = await ParkingRequest.findByIdAndDelete(
      req.params.id
    );

    if (!deletedRequest) {
      return res.status(404).json({ message: "Parking request not found" });
    }

    res.status(200).json({ message: "Parking request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
