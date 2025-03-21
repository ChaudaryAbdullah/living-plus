import mongoose from "mongoose";

const sendNotificationOwnerSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
  },
  { timestamps: true }
);

export const SendNotificationOwner = mongoose.model(
  "SendNotificationOwner",
  sendNotificationOwnerSchema
);
