import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  rtype: {
    type: String,
    required: true,
    maxlength: 100, // Same as SQL varchar(100)
  },
  status: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 256, // Fixing typo from `descript` → `description`
  },
  price: {
    type: Number,
    required: true,
  },
  rentalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rental", // Reference to the Rental collection
    required: true,
  },
  picture: {
    type: String, // Storing image URL or file path
    maxlength: 256,
  },
});

export const Room = mongoose.model("Room", roomSchema);
