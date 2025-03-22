import express from "express";
import { Feedback } from "../models/feedbackModel.js";

const router = express.Router();

// ✅ Create new feedback
router.post("/", async (req, res) => {
  try {
    const { rating, description, rentalId, tenantId } = req.body;

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const newFeedback = new Feedback({
      rating,
      description,
      rentalId,
      tenantId,
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("rentalId", "name address") // Populates rental info
      .populate("tenantId", "name email"); // Populates tenant info

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get feedback by rental ID
router.get("/:rentalId", async (req, res) => {
  try {
    const { rentalId } = req.params;
    const feedbacks = await Feedback.find({ rentalId }).populate(
      "tenantId",
      "name email"
    );

    // if (!feedbacks.length) {
    //   return res
    //     .status(404)
    //     .json({ message: "No feedback found for this rental" });
    // }

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update feedback by ID
router.put("/:id", async (req, res) => {
  try {
    const { rating, description } = req.body;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { rating, description },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete feedback by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
