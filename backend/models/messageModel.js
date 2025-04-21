const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatToken: { type: String, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
