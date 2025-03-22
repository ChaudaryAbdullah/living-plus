import { Applicant } from "../models/applicantModel.js";
import { Owner } from "../models/ownerModel.js";
import { Tenant } from "../models/tenantModel.js";
import express from "express";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find applicant by email
    let applicant = await Applicant.findOne({
      $or: [{ userName: email }, { email: email }],
    });

    if (!applicant) {
      return res.status(404).send({ message: "Invalid credentials" });
    }

    let tenant = await Tenant.findOne({
      $or: [{ userName: email }, { email: email }],
    });
    let owner = await Owner.findOne({
      $or: [{ userName: email }, { email: email }],
    });

    if (!owner || !tenant) {
      return res.status(400).send({ message: "Something went wrong!" });
    }

    // Check password
    if (applicant.password !== password) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    if (!req.session) {
      return res
        .status(500)
        .send({ message: "Session not initialized correctly." });
    }

    req.session.user = {
      id: applicant._id,
      tenantId: tenant._id,
      ownerId: owner._id,
      userName: applicant.userName,
      email: applicant.email,
    };

    console.log(req.session.user);
    // Login successful
    res.status(200).send({
      message: "Login successful",
      user: {
        userName: applicant.userName,
        email: applicant.email,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json({ user: req.session.user });
});
export default router;
