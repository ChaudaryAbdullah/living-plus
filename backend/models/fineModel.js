import mongoose from "mongoose";

const fineSchema = mongoose.Schema(
  {
    issueDate: { type: Date, required: true },
    reason: { type: String, maxlength: 150, required: true },
    amount: { type: Number, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  { timestamps: true }
);

export const Fine = mongoose.model("Fine", fineSchema);
