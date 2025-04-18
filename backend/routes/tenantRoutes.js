import express from "express";
import { Tenant } from "../models/tenantModel.js";
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
    const newTenant = new Tenant({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      dob: req.body.dob,
      email: req.body.email,
      password: req.body.password,
    });
    await newTenant.save();
    return res
      .status(201)
      .send({ message: "New tenant created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tenants = await Tenant.find();
    return res.status(200).send(tenants);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const tenant = await Tenant.findOne({ email });

    if (!tenant) {
      return res.status(404).send({ message: "Tenant not found" });
    }

    return res.status(200).send(tenant);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).send({ message: "Tenant not found" });
    }
    return res.status(200).send(tenant);
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

    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).send({ message: "Tenant not found" });
    }
    tenant.userName = req.body.userName;
    tenant.firstName = req.body.firstName;
    tenant.lastName = req.body.lastName;
    tenant.address = req.body.address;
    tenant.dob = req.body.dob;
    tenant.email = req.body.email;
    tenant.password = req.body.password;
    await tenant.save();
    return res.status(200).send({ message: "Tenant updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findByIdAndDelete(id);
    if (!tenant) {
      return res.status(404).send({ message: "Tenant not found" });
    }
    return res.status(200).send({ message: "Tenant deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
