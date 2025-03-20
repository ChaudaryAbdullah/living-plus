import mongoose from "mongoose";

const ownsSchema = mongoose.Schema(
  {
    ownId: { type: Number, required: true, unique: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      required: true,
    },
  },
  { timestamps: true }
);

export const Owns = mongoose.model("Owns", ownsSchema);
