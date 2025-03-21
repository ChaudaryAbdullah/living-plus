import mongoose from "mongoose";

const ownsSchema = mongoose.Schema(
  {
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

ownsSchema.index({ ownerId: 1, rentalId: 1 }, { unique: true });
export const Owns = mongoose.model("Owns", ownsSchema);
