const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  origin: String,
  isLuxury: { type: Boolean, default: false }
});

module.exports = mongoose.model('ClothingBrand', clothingSchema);