import mongoose from "mongoose";

const parkingSlotSchema = mongoose.Schema({
  isOccupied: {
    type: Boolean,
    required: true,
  },
  rentalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental", // References the Rental collection
    required: true,
  },
});

export const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
