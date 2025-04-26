import express from "express";
import { Room } from "../models/roomModel.js";
import { Rental } from "../models/rentalModel.js";
const router = express.Router();

// Create a new room
router.post("/", async (req, res) => {
  try {
    const { rtype, status, description, price, rentalId, picture } = req.body;
    if (!rtype || !status || !price || !rentalId) {
      return res
        .status(400)
        .send({ message: "Please fill all the required fields" });
    }

    // First find the rental by ID
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).send({ message: "Rental not found" });
    }

    // Then update the rental's availableRooms and totalRooms
    rental.availableRooms += 1;
    rental.totalRooms += 1;
    await rental.save(); // Save the updated rental

    // Now create the new room
    const newRoom = new Room({
      rtype,
      status,
      description,
      price,
      rentalId,
      picture,
    });

    await newRoom.save();

    return res.status(201).send({ message: "New room created successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
});

// Get all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).send(rooms);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get a room by ID
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    return res.status(200).send(room);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Update a room by ID
router.put("/:id", async (req, res) => {
  try {
    const { rtype, status, description, price, rentalId, picture } = req.body;
    if (!rtype || !status || !price || !rentalId) {
      return res
        .status(400)
        .send({ message: "Please fill all the required fields" });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    room.rtype = rtype;
    room.status = status;
    room.description = description;
    room.price = price;
    room.rentalId = rentalId;
    room.picture = picture;
    await room.save();

    return res.status(200).send({ message: "Room updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Delete a room by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }
    await Rental.findByIdAndUpdate(rentalId, {
      availableRooms: req.data.availableRooms + 1,
    });
    return res.status(200).send({ message: "Room deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
