const express = require('express');
const { z } = require('zod');
const mongoose = require('mongoose');

const { auth, requireRole } = require('../middleware/auth');
const Review = require('../models/Review');
const Worker = require('../models/Worker');
const Client = require('../models/Client');

const router = express.Router();

const upsertReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().max(1000).optional().default('')
});

async function recalcWorkerRating(workerId) {
  const _id = new mongoose.Types.ObjectId(workerId);
  const agg = await Review.aggregate([
    { $match: { worker: _id } },
    { $group: { _id: '$worker', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  const avg = agg[0]?.avgRating ?? 0;
  const count = agg[0]?.count ?? 0;

  // store one-decimal avg like 4.2
  const rounded = Math.round(avg * 10) / 10;

  await Worker.findByIdAndUpdate(workerId, { rating: rounded, reviewCount: count });
  return { rating: rounded, reviewCount: count };
}

// Public: list reviews
router.get('/workers/:workerId/reviews', async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const skip = Math.max(parseInt(req.query.skip || '0', 10), 0);

    const reviews = await Review.find({ worker: workerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('rating text clientName clientProfileImage createdAt updatedAt');

    return res.json({ success: true, reviews });
  } catch (err) {
    return next(err);
  }
});

// Client: get my review
router.get('/workers/:workerId/my-review', auth, async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const clientId = req.user.client;
    if (!clientId) {
      return res.status(403).json({ success: false, error: 'You need a client account to view reviews. Please register as a client first.' });
    }

    const review = await Review.findOne({ worker: workerId, client: clientId })
      .select('rating text createdAt updatedAt');

    return res.json({ success: true, review: review || null });
  } catch (err) {
    return next(err);
  }
});

// Client: create/update review (UPsert) ✅ one review only
router.post('/workers/:workerId/reviews', auth, async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const clientId = req.user.client;
    // Check if user has a client profile (required to review)
    if (!clientId) {
      return res.status(403).json({ success: false, error: 'You need a client account to review workers. Please register as a client first.' });
    }

    const worker = await Worker.findById(workerId).select('_id');
    if (!worker) return res.status(404).json({ success: false, error: 'Worker not found' });

    const parsed = upsertReviewSchema.parse(req.body || {});
    const client = await Client.findById(clientId).select('name profileImage');

    const update = {
      rating: parsed.rating,
      text: parsed.text || '',
      clientName: client?.name || 'Client',
      clientProfileImage: client?.profileImage || ''
    };

    const review = await Review.findOneAndUpdate(
      { worker: workerId, client: clientId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const stats = await recalcWorkerRating(workerId);

    return res.json({ success: true, review, worker: { id: workerId, ...stats } });
  } catch (err) {
    return next(err);
  }
});

// Client: delete my review
router.delete('/workers/:workerId/reviews', auth, async (req, res, next) => {
  try {
    const { workerId } = req.params;
    const clientId = req.user.client;
    if (!clientId) {
      return res.status(403).json({ success: false, error: 'You need a client account to delete reviews. Please register as a client first.' });
    }

    await Review.findOneAndDelete({ worker: workerId, client: clientId });
    const stats = await recalcWorkerRating(workerId);

    return res.json({ success: true, worker: { id: workerId, ...stats } });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
