import express from "express";
import { Owner } from "../models/ownerModel.js";
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
    const newowner = new Owner({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      dob: req.body.dob,
      email: req.body.email,
      password: req.body.password,
    });
    await newowner.save();
    return res.status(201).send({ message: "New owner created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const owners = await Owner.find();
    return res.status(200).send(owners);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).send({ message: "owner not found" });
    }
    return res.status(200).send(owner);
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

    const owner = await Owner.findById(req.params.id);
    if (!owner) {
      return res.status(404).send({ message: "owner not found" });
    }
    owner.userName = req.body.userName;
    owner.firstName = req.body.firstName;
    owner.lastName = req.body.lastName;
    owner.address = req.body.address;
    owner.dob = req.body.dob;
    owner.email = req.body.email;
    owner.password = req.body.password;
    await owner.save();
    return res.status(200).send({ message: "Owner updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findByIdAndDelete(id);
    if (!owner) {
      return res.status(404).send({ message: "Owner not found" });
    }
    return res.status(200).send({ message: "Owner deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
