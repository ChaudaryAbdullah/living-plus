import express from "express";
import { Rental } from "../models/rentalModel.js";
const router = express.Router();

// Create a new rental
router.post("/", async (req, res) => {
  try {
    const { rentalName, address, facilities, totalRooms, availableRooms } =
      req.body;
    if (
      !rentalName ||
      !address ||
      !facilities ||
      !totalRooms ||
      !availableRooms
    ) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    const newRental = new Rental({
      rentalName,
      address,
      facilities,
      totalRooms,
      availableRooms,
    });
    await newRental.save();
    return res
      .status(201)
      .send({ message: "New rental created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get all rentals
router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find();
    return res.status(200).send(rentals);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get a rental by ID
router.get("/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).send({ message: "Rental not found" });
    }
    return res.status(200).send(rental);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Update a rental by ID
router.put("/:id", async (req, res) => {
  try {
    const { rentalName, address, facilities, totalRooms, availableRooms } =
      req.body;
    if (
      !rentalName ||
      !address ||
      !facilities ||
      !totalRooms ||
      !availableRooms
    ) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).send({ message: "Rental not found" });
    }

    rental.rentalName = rentalName;
    rental.address = address;
    rental.facilities = facilities;
    rental.totalRooms = totalRooms;
    rental.availableRooms = availableRooms;
    await rental.save();

    return res.status(200).send({ message: "Rental updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Delete a rental by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete(id);
    if (!rental) {
      return res.status(404).send({ message: "Rental not found" });
    }
    return res.status(200).send({ message: "Rental deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
