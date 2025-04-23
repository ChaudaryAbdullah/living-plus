import { Router } from "express";
const router = Router();

import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";

// Create or get a chat
router.post("/initiate", async (req, res) => {
  const { propertyId, applicantId, ownerId } = req.body;
  try {
    let chat = await Chat.findOne({ propertyId, applicantId, ownerId });
    if (!chat) {
      chat = await create({
        propertyId,
        applicantId,
        ownerId,
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
    const messages = await Message.find({
      chatId: req.params.chatToken,
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", err });
  }
});

router.get("/:user/chats", async (req, res) => {
  try {
    console.log(req.params.user);
    const messages = await Chat.find({
      $or: [{ applicantId: req.params.user }, { ownerId: req.params.user }],
    })
      .populate("propertyId")
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", err });
  }
});

// Send a message
router.post("/message", async (req, res) => {
  try {
    // Log chatId, senderId, and message using a logging library if needed
    console.log(
      `chatId: ${req.body.chatId}, senderId: ${req.body.senderId}, message: ${req.body.message}`
    );
    const msg = new Message({
      chatId: req.body.chatId,
      senderId: req.body.senderId,
      senderType: req.body.senderType,
      message: req.body.message,
    });
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", err });
  }
});

// Find or create a chat by applicantId, propertyId, and ownerId
router.get("/findOrCreate", async (req, res) => {
  const { propertyId, applicantId, ownerId } = req.query;

  try {
    let chat = await Chat.findOne({ propertyId, applicantId, ownerId });

    if (!chat) {
      chat = await Chat.create({ propertyId, applicantId, ownerId });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error finding or creating chat", err });
  }
});

export default router;
