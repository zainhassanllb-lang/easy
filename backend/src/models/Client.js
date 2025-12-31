const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    locality: { type: String, default: '' },
    profileImage: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', ClientSchema);
