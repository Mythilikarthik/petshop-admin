const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // for parsing JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// Schema
const AdminSchema = new mongoose.Schema({
  id : Number,
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema, 'admin');
const UserSchema = new mongoose.Schema({
  id : Number,
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema, 'user');


// Routes
app.post('/api/login', async (req, res) => {
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
app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(username + "/" + password)
    const user = await User.findOne({ username, password });
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
