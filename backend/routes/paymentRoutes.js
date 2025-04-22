import express from "express";
import { Payment } from "../models/paymentModel.js";

const router = express.Router();

// Create a new payment
router.post("/", async (req, res) => {
  try {
    const { method, total, status, tenantId, dueDate } = req.body;

    if (!method || total === undefined || status === undefined || !tenantId || !dueDate) {
      return res.status(400).send({ message: "Please fill all the required fields" });
    }

    const newPayment = new Payment({ method, total, status, tenantId, dueDate });
    await newPayment.save();

    return res.status(201).send({ message: "New payment created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().populate("tenantId");
    return res.status(200).send(payments);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get a payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("tenantId");
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }
    return res.status(200).send(payment);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Update a payment by ID
router.put("/:id", async (req, res) => {
  try {
    const { method, total, status, tenantId, dueDate } = req.body;

    if (!method || total === undefined || status === undefined || !tenantId || !dueDate) {
      return res.status(400).send({ message: "Please fill all the required fields" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).send({ message: "Payment not found" });
    }

    payment.method = method;
    payment.total = total;
    payment.status = status;
    payment.tenantId = tenantId;
    payment.dueDate = dueDate;

    await payment.save();

    return res.status(200).send({ message: "Payment updated successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Delete a payment by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send({ message: "Payment not found" });
    }
    return res.status(200).send({ message: "Payment deleted successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

// Get payments by tenant ID
router.get("/tenant/:tenantId", async (req, res) => {
  try {
    const payments = await Payment.find({ tenantId: req.params.tenantId , status: false,});
    if (!payments.length) {
      return res.status(404).send({ message: "No payments found for this tenant" });
    }
    return res.status(200).send(payments);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

export default router;
