const rentSchema = new mongoose.Schema(
  {
    amount: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room", // References the Room collection
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant", // References the Tenant collection
      required: true,
    },
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental", // References the Rental collection
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Rent = mongoose.model("Rent", rentSchema);
