const express = require('express');
const router = express.Router();
const Admin = require('../Models/Admin');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(username + "/" + password)
    const user = await Admin.findOne({ username, password });
    if (user) {
      res.json({ success: true, message: 'Login successful', username: user.username, token: "dummy-token-123" });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;