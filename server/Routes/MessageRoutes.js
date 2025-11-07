const express = require('express');
const router = express.Router();
const Message = require('../Models/Message');
const { verifyToken } = require('../middleware/authMiddleware');

// Send a new message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    res.json({ success: true, message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// routes/messages.js
router.put("/:id/read", verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.receiverId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    message.read = true;
    await message.save();

    // Emit socket event for unread count update
    if (global.io) {
      global.io.to(req.userId.toString()).emit("message_read", {
        messageId: message._id,
        receiverId: req.userId,
      });
    }

    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get unread messages count for the logged-in user
router.get("/unread/count", verifyToken, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.userId,
      read: false,
    });

    res.json({ success: true, count });
  } catch (err) {
    console.error("Error fetching unread count:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// backend/routes/messages.js
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    if (!message) {
      return res.json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching message" });
  }
});


// Get conversation between two users
router.get('/conversation/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.get("/all", async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ $or : [{senderId: req.userId}, {receiverId: req.userId}] })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
