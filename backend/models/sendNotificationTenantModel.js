import mongoose from "mongoose";

const sendNotificationTenantSchema = mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
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

export const SendNotificationTenant = mongoose.model(
  "SendNotificationTenant",
  sendNotificationTenantSchema
);
