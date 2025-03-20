import mongoose from "mongoose";

const ownerSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 16,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Owner = mongoose.model("OWner", ownerSchema);
