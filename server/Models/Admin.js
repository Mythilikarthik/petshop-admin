const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  id: Number,
  username: String,
  email: String,
  phone: String,
  name: String,
  password: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema, 'admin');
