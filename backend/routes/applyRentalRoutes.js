import express from "express";
import { ApplyRental } from "../models/applyRentalModel.js";

const router = express.Router();

// Apply for a rental
router.post("/", async (req, res) => {
  try {
    const { rentalId, applicantId, roomId } = req.body;
    console.log(applicantId, rentalId, roomId);
    if (!rentalId || !applicantId || !roomId) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields" });
    }

    const newApplication = new ApplyRental({
      rentalId,
      applicantId,
      roomId,
    });

    await newApplication.save();
    return res
      .status(201)
      .send({ message: "Application submitted successfully!" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ message: err.message });
  }
});

// Get all rental applications
router.get("/", async (req, res) => {
  try {
    const applications = await ApplyRental.find()
      .populate("rentalId", "rentalName") // Populate rental details
      .populate("applicantId", "name email") // Populate applicant details
      .populate("roomId", "rtype price"); // Populate room details

    return res.status(200).send(applications);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get a rental application by ID
router.get("/:id", async (req, res) => {
  try {
    const application = await ApplyRental.findById(req.params.id)
      .populate("rentalId", "rentalName")
      .populate("applicantId", "name email")
      .populate("roomId", "rtype price");

    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    return res.status(200).send(application);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Update a rental application by ID
router.put("/:id", async (req, res) => {
  try {
    const { rentalId, applicantId, roomId } = req.body;

    const application = await ApplyRental.findById(req.params.id);
    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    application.rentalId = rentalId || application.rentalId;
    application.applicantId = applicantId || application.applicantId;
    application.roomId = roomId || application.roomId;

    await application.save();
    return res
      .status(200)
      .send({ message: "Application updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Delete a rental application by applicant
router.delete("/applicant/:applicantId", async (req, res) => {
  const { applicantId } = req.params;

  try {
    const deleted = await ApplyRental.findOneAndDelete({ applicantId });

    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a rental application by ID
router.delete("/:id", async (req, res) => {
  try {
    const application = await ApplyRental.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }

    return res
      .status(200)
      .send({ message: "Application deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/rental/:rentalId", async (req, res) => {
  try {
    const { rentalId } = req.params;

    const applications = await ApplyRental.find({ rentalId })
      .populate("rentalId", "rentalName")
      .populate("applicantId", "name email")
      .populate("roomId", "rtype price");

    return res.status(200).send(applications);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
