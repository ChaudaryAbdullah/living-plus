import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    dateTime: { type: Date, required: true },
    description: { type: String, maxlength: 150, required: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
