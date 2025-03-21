import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    _id: {
      type: Number,
      primaryKey: true,
      autoIncrement: true,
    },
    dateTime: { type: Date, required: true },
    description: { type: String, maxlength: 150, required: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
