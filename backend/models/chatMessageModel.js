// project/backend/models/chatMessageModel.js
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "rental",
  }, // assuming rental = property
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderType: { type: String, enum: ["tenant", "owner"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("ChatMessage", chatMessageSchema);
