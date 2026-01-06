const express = require('express');
const Worker = require('../models/Worker');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const SupportMessage = require('../models/SupportMessage');

const router = express.Router();

router.post('/admin/verify-worker', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { workerId, approved } = req.body;
    if (!workerId) return res.status(400).json({ error: 'Worker ID is required' });

    if (approved) {
      await Worker.findByIdAndUpdate(workerId, {
        isVerified: true,
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        pendingCnicUpdate: false
      });
    } else {
      await Worker.findByIdAndUpdate(workerId, {
        isVerified: false,
        verificationStatus: 'rejected',
        verifiedAt: null
      });
    }

    return res.json({ success: true, approved: !!approved });
  } catch (err) {
    return next(err);
  }
});

router.post('/admin/verify-payment', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { workerId, approved } = req.body;
    if (!workerId) return res.status(400).json({ error: 'Worker ID is required' });

    const update = {
      paymentStatus: approved ? 'verified' : 'rejected'
    };

    if (approved) {
      update.hasPurchasedPackage = true;
      update.isActive = true;
      update.packagePurchasedAt = new Date();
    } else {
      update.hasPurchasedPackage = false;
      update.isActive = false;
    }

    await Worker.findByIdAndUpdate(workerId, update);

    return res.json({ success: true, approved: !!approved });
  } catch (err) {
    return next(err);
  }
});

router.post('/admin/cancel-package', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ error: 'Worker ID is required' });

    await Worker.findByIdAndUpdate(workerId, {
      packageType: null,
      packageExpiry: null,
      packagePurchasedAt: null,
      hasPurchasedPackage: false,
      paymentStatus: null,
      paymentProof: null,
      paymentMeta: null
    });

    return res.json({ success: true, message: 'Package cancelled successfully' });
  } catch (err) {
    return next(err);
  }
});

router.get('/admin/unverified-workers', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const workers = await Worker.find({ verificationStatus: { $in: ['pending', 'rejected'] } }).sort({ createdAt: -1 });
    return res.json({ success: true, workers });
  } catch (err) {
    return next(err);
  }
});

router.get('/admin/client-count', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const count = await User.countDocuments({ role: 'client' });
    return res.json({ success: true, count });
  } catch (err) {
    return next(err);
  }
});

router.get('/admin/payments-pending', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const workers = await Worker.find({ paymentStatus: 'pending' }).sort({ updatedAt: -1 });
    return res.json({ success: true, workers });
  } catch (err) {
    return next(err);
  }
});

router.delete('/admin/workers/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const workerId = req.params.id;
    if (!workerId) return res.status(400).json({ error: 'Worker ID is required' });

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    // Find and delete associated user
    await User.findOneAndDelete({ worker: worker._id });

    // Delete worker profile
    await Worker.findByIdAndDelete(workerId);

    return res.json({ success: true, message: 'Worker and associated user deleted successfully' });
  } catch (err) {
    return next(err);
  }
});

router.get('/admin/support-messages', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch (err) {
    return next(err);
  }
});

router.patch('/admin/support-messages/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const message = await SupportMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    return res.json({ success: true, message });
  } catch (err) {
    return next(err);
  }
});

router.delete('/admin/support-messages/:id', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const message = await SupportMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    return res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

