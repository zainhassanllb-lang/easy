const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // basic/standard/premium
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 }, // days
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    rank: { type: Number, default: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', PackageSchema);
