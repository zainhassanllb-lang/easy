const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false }, // Optional for Google OAuth users
    googleId: { type: String, required: false, unique: true, sparse: true }, // For Google OAuth
    role: { type: String, enum: ['worker', 'client', 'admin'], required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
    resetPasswordOTP: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

UserSchema.methods.verifyPassword = async function verifyPassword(password) {
  if (!this.passwordHash) return false; // Google OAuth users don't have passwords
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.statics.hashPassword = async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = mongoose.model('User', UserSchema);
