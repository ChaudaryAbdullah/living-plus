import { Router } from "express";
const router = Router();
import { findOne, create } from "../models/chatModel";
import { find, create as _create } from "../models/messageModel";
import { v4 as uuidv4 } from "uuid";

// Create or get a chat
router.post("/initiate", async (req, res) => {
  const { propertyId, applicantId, ownerId } = req.body;
  try {
    let chat = await findOne({ propertyId, applicantId, ownerId });
    if (!chat) {
      chat = await create({
        propertyId,
        applicantId,
        ownerId,
        chatToken: uuidv4(),
      });
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error creating chat", err });
  }
});

// Get messages for a chat
router.get("/messages/:chatToken", async (req, res) => {
  try {
    const messages = await find({
      chatToken: req.params.chatToken,
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", err });
  }
});

// Send a message
router.post("/message", async (req, res) => {
  const { chatToken, senderId, message } = req.body;
  try {
    const msg = await _create({ chatToken, senderId, message });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", err });
  }
});

export default router;
