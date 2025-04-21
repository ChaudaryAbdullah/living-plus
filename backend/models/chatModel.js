const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental",
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  chatToken: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Chat", chatSchema);
