import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1, // Assuming rating is between 1 and 5
      max: 5,
    },
    description: {
      type: String,
      maxlength: 256,
    },
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental", // References the Rental collection
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant", // References the Tenant collection
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
