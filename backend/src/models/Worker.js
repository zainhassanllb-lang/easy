const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    locality: { type: [String], required: true, default: [] }, // Array for multiple localities
    category: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    skills: { type: [String], default: [] },
    about: { type: String, required: true },
    cnicNumber: { type: String, required: true, trim: true },
    cnicImages: { type: [String], default: [] },
    selfieImage: { type: String, default: '' },
    profileImage: { type: String, default: '' },

    // Verification
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    pendingCnicUpdate: { type: Boolean, default: true },

    // Package & payment
    packageType: { type: String, enum: ['basic', 'standard', 'premium', null], default: null },
    packageExpiry: { type: Date, default: null },
    hasPurchasedPackage: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    paymentProof: { type: String, default: null },
    paymentStatus: { type: String, enum: ['pending', 'verified', 'rejected', null], default: null },

    // Meta about the last submitted manual payment (for admin review)
    paymentMeta: {
      method: { type: String, default: null },
      phoneNumber: { type: String, default: null },
      accountNumber: { type: String, default: null },
      amount: { type: Number, default: null },
      submittedAt: { type: Date, default: null }
    },

    // Stats
    profileViews: { type: Number, default: 0 },
    profileClicks: { type: Number, default: 0 },
    contactClicks: { type: Number, default: 0 },
    whatsappClicks: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

WorkerSchema.methods.isPackageActive = function isPackageActive() {
  if (!this.hasPurchasedPackage) return false;
  if (!this.packageExpiry) return true;
  return new Date(this.packageExpiry) >= new Date();
};

module.exports = mongoose.model('Worker', WorkerSchema);
