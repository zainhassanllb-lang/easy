const express = require('express');
const { z } = require('zod');
const Worker = require('../models/Worker');
const Package = require('../models/Package');
const { auth, requireRole } = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

const processPaymentSchema = z.object({
  packageType: z.enum(['basic', 'standard', 'premium']),
  paymentMethod: z.enum(['jazzcash', 'easypaisa', 'bank']),
  phoneNumber: z.string().optional().default(''),
  accountNumber: z.string().optional().default(''),
  amount: z.number().nonnegative(),
  paymentProof: z.string().min(10)
});

// Worker submits manual payment proof (goes to admin for approval)
router.post('/process-payment', auth, requireRole('worker'), async (req, res, next) => {
  try {
    const data = processPaymentSchema.parse(req.body);

    const workerId = req.user.worker;
    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const pkg = await Package.findOne({ name: data.packageType });
    if (!pkg) return res.status(400).json({ error: 'Invalid package' });

    // Save proof image to Cloudinary
    let uploadRes;
    try {
      uploadRes = await cloudinary.uploader.upload(data.paymentProof, {
        folder: 'easy/payments',
        resource_type: 'image'
      });
    } catch (uploadErr) {
      console.error('Cloudinary upload error:', uploadErr);
      return res.status(500).json({
        error: 'Failed to upload payment proof. Please check image format and size.',
        details: uploadErr.message
      });
    }

    const proofPath = uploadRes.secure_url;

    // Mark as pending. Package is set but not activated until admin verifies.
    worker.packageType = data.packageType;
    worker.packageExpiry = new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000);
    worker.hasPurchasedPackage = false;
    worker.paymentProof = proofPath;
    worker.paymentStatus = 'pending';
    worker.paymentMeta = {
      method: data.paymentMethod,
      phoneNumber: data.phoneNumber || null,
      accountNumber: data.accountNumber || null,
      amount: data.amount,
      submittedAt: new Date()
    };

    await worker.save();

    return res.json({ success: true, status: 'pending' });
  } catch (err) {
    return next(err);
  }
});

// Optional: instantly purchase package (no proof) - useful if you later integrate gateway
router.post('/purchase-package', auth, requireRole('worker'), async (req, res, next) => {
  try {
    const { packageType } = z.object({ packageType: z.enum(['basic', 'standard', 'premium']) }).parse(req.body);
    const worker = await Worker.findById(req.user.worker);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const pkg = await Package.findOne({ name: packageType });
    if (!pkg) return res.status(400).json({ error: 'Invalid package' });

    worker.packageType = packageType;
    worker.hasPurchasedPackage = true;
    worker.paymentStatus = 'verified';
    worker.packageExpiry = new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000);
    await worker.save();

    return res.json({ success: true, worker });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
