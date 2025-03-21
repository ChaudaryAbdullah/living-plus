import mongoose from "mongoose";
const parkingAllocationSchema = mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSlot", // References the ParkingSlot collection
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

export const ParkingAllocation = mongoose.model(
  "ParkingAllocation",
  parkingAllocationSchema
);
