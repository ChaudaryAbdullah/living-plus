import multer from "multer";
import express from "express";
import { Rental } from "../models/rentalModel.js";
import { uploadImage } from "../cloudinary.js";
import { Owns } from "../models/ownsModel.js";

const router = express.Router();

const storage = multer.memoryStorage(); // store in memory first
const upload = multer({ storage: storage });

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const { rentalName, address, facilities, totalRooms, availableRooms } =
      req.body;
    const files = req.files; // access uploaded files
    console.log("Files received:", files);

    if (
      !rentalName ||
      !address ||
      !facilities ||
      !totalRooms ||
      !availableRooms ||
      !files ||
      files.length === 0
    ) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    const uploadedImageUrls = [];

    for (const file of files) {
      const buffer = file.buffer.toString("base64"); // convert buffer to base64
      const imageUrl = await uploadImage(
        `data:${file.mimetype};base64,${buffer}`
      );
      if (imageUrl) {
        uploadedImageUrls.push(imageUrl);
      }
    }

    const newRental = new Rental({
      rentalName,
      address,
      facilities,
      totalRooms,
      availableRooms,
      images: uploadedImageUrls, // array of Cloudinary URLs
    });

    await newRental.save();
    console.log("rental made");
    const ownsData = {
      rentalId: newRental._id,
      ownerId: req.body.ownerId,
    };

    console.log("Creating owns relationship:", ownsData);

    // Here you can call another controller, service, or simply save it
    const newOwns = new Owns(ownsData); // Assuming you have an "Owns" model
    await newOwns.save();

    return res
      .status(201)
      .send({ message: "New rental created successfully!" });
  } catch (err) {
    console.error(err);
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
