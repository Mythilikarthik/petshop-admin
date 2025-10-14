const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  city: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('City', CitySchema, 'cities');
