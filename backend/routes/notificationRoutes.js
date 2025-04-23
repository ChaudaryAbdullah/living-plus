import express from "express";
import { Notification } from "../models/notificationModel.js";
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    const { tenantId, date, description } = req.body;

    if (!tenantId || !date || !description) {
      return res.status(400).json({ error: 'tenantId, date, and description are required.' });
    }

    const newNotification = new Notification({
      tenantId,
      date,
      description,
      read: false, // Default to unread
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all notifications for a user - handle both userId and tenantId
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ 
      $or: [{ userId: id }, { tenantId: id }]
    }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// Clear all notifications for a user (handles both userId and tenantId)
router.delete('/clear-all/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.deleteMany({ 
      $or: [{ userId: id }, { tenantId: id }] 
    });
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
});


export default router;