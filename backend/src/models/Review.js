const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true, index: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, trim: true, default: '', maxlength: 1000 },

    // optional denormalized fields for fast display
    clientName: { type: String, trim: true, default: '' },
    clientProfileImage: { type: String, default: '' }
  },
  { timestamps: true }
);

// ✅ One review per client per worker
ReviewSchema.index({ worker: 1, client: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
