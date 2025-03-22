import express from "express";
import { Applicant } from "../models/applicantModel.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.userName ||
      !req.body.address ||
      !req.body.dob ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }
    const newApplicant = new Applicant({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      dob: req.body.dob,
      email: req.body.email,
      password: req.body.password,
    });
    await newApplicant.save();
    return res
      .status(201)
      .send({ message: "New applicant created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const applicants = await Applicant.find();
    return res.status(200).send(applicants);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/:userName", async (req, res) => {
  try {
    const applicant = await Applicant.findOne({
      userName: req.params.userName,
    });

    if (!applicant) {
      return res.status(404).send({ message: "Applicant not found" });
    }
    return res.status(200).send(applicant);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.userName ||
      !req.body.address ||
      !req.body.dob ||
      !req.body.email ||
      !req.body.password
    ) {
      return res.status(400).send({ message: "Please fill all the fields" });
    }

    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res.status(404).send({ message: "Applicant not found" });
    }
    applicant.userName = req.body.userName;
    applicant.firstName = req.body.firstName;
    applicant.lastName = req.body.lastName;
    applicant.address = req.body.address;
    applicant.dob = req.body.dob;
    applicant.email = req.body.email;
    applicant.password = req.body.password;
    await applicant.save();
    return res.status(200).send({ message: "Applicant updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await Applicant.findByIdAndDelete(id);
    if (!applicant) {
      return res.status(404).send({ message: "Applicant not found" });
    }
    return res.status(200).send({ message: "Applicant deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
