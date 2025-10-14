const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema, 'admin');
