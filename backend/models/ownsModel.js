import mongoose from "mongoose";

const ownsSchema = mongoose.Schema(
  {
    ownerId: {
      type: Number,
      ref: "Owner",
      required: true,
    },
    rentalId: {
      type: Number,
      ref: "Rental",
      required: true,
    },
  },
  { timestamps: true }
);

// ownsSchema.index({ ownerId: 1, rentalId: 1 }, { unique: true });
export const Owns = mongoose.model("Owns", ownsSchema);
