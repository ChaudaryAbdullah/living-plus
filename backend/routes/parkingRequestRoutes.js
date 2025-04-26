import { ParkingRequest } from "../models/parkingRequestModel.js";
import { ParkingAllocation } from "../models/parkingAllocationModel.js";
import express from "express";
import { log } from "console";
import { console } from "inspector";
const router = express.Router();

// Create a new parking request
router.post("/", async (req, res) => {
  try {
    const { slotId, tenantId } = req.body;
    console.log(slotId, tenantId);
    if (!slotId || !tenantId)
      return res.status(404).json({ message: "Something went wrong" });
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

// Get parking requests by rental ID
router.get("/rental/:rentalId", async (req, res) => {
  try {
    const { rentalId } = req.params;
    const requests = await ParkingRequest.find()
      .populate({
        path: "slotId",
        match: { rentalId: rentalId }, // Filter slots that belong to the rental
      })
      .populate("tenantId");

    // Filter out any requests where slotId is null (i.e., slot didn't match rentalId)
    const filteredRequests = requests.filter((request) => request.slotId);

    // if (!filteredRequests.length) {
    //   return res
    //     .status(404)
    //     .json({ message: "No parking requests found for this rental" });
    // }

    res.status(200).json(filteredRequests);
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

router.post("/accept/:parkingRequestId", async (req, res) => {
  try {
    const { parkingRequestId } = req.params;

    // Find the parking request by its ID
    const request = await ParkingRequest.findById(parkingRequestId);
    console.log(request);
    if (!request) {
      return res.status(404).json({ message: "Parking request not found" });
    }

    // Check if slot already allocated
    const existingAllocation = await ParkingAllocation.findOne({
      slotId: request.slotId,
    });
    if (existingAllocation) {
      return res.status(400).json({ message: "Slot is already allocated" });
    }

    // Move request to ParkingAllocation
    const newAllocation = new ParkingAllocation({
      slotId: request.slotId,
      tenantId: request.tenantId,
    });
    await newAllocation.save();

    // Delete the accepted request
    await ParkingRequest.findByIdAndDelete(request._id);

    res.status(200).json({
      message: "Parking request accepted and allocated",
      allocation: newAllocation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/reject/:parkingRequestId", async (req, res) => {
  try {
    const { parkingRequestId } = req.params;

    // Find the parking request by its ID
    const request = await ParkingRequest.findById(parkingRequestId);
    console.log(request);
    if (!request) {
      return res.status(404).json({ message: "Parking request not found" });
    }

    // Delete the accepted request
    await ParkingRequest.findByIdAndDelete(request._id);

    res.status(200).json({
      message: "Parking request rejected",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
