import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // We don't specify a single ref here
  },
  senderType: {
    type: String,
    enum: ["Applicant", "Owner"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Add a virtual property or method for populating the correct model
messageSchema.virtual("sender").get(function () {
  // This will need to be populated manually
  return this._sender;
});

// Define a method to populate the sender
messageSchema.methods.populateSender = async function () {
  const Model =
    this.senderType === "Owner"
      ? mongoose.model("Owner")
      : mongoose.model("Applicant");
  this._sender = await Model.findById(this.senderId);
  return this._sender;
};

export const Message = mongoose.model("Message", messageSchema);
