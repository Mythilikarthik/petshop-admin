const mongoose = require('mongoose');
const Listing = require('./Listing');

const CitySchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true, trim: true },
  show: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

CitySchema.pre('findOneAndDelete', async function(next) {
  const city = await this.model.findOne(this.getFilter());
  const inUse = await Listing.exists({ city: city._id });
  if (inUse) {
    const err = new Error("Some listings are using this city. Delete not allowed.");
    err.code = 400;
    return next(err);
  }
  next();
});

module.exports = mongoose.model('City', CitySchema, 'cities');
