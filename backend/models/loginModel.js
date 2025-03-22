import mongoose from "mongoose";

const applicantSchema = mongoose.Schema(
  {
    ownerid: {
      type: String,
      ref: "owner",
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
  },
  {
    timestamps: true,
  }
);

export const Applicant = mongoose.model("Applicant", applicantSchema);
