const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema, 'user');
