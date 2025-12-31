const express = require('express');
const { z } = require('zod');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Package = require('../models/Package');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const { signToken, cookieOptions } = require('../utils/jwt');
const { auth, requireRole, optionalAuth } = require('../middleware/auth');
const { createUploader } = require('../middleware/upload');

const router = express.Router();
const upload = createUploader('workers');
const SupportMessage = require('../models/SupportMessage');

const registerWorkerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(5),
  whatsapp: z.string().min(5),
  city: z.string().min(1),
  locality: z.union([z.string(), z.array(z.string())]).transform((val) => Array.isArray(val) ? val : [val]),
  category: z.string().min(1),
  experience: z.coerce.number().int().nonnegative(),
  skills: z.union([z.string(), z.array(z.string())]).optional().default([]),
  about: z.string().min(1),
  cnicNumber: z.string().min(5)
});

function setAuthCookie(res, token) {
  const cookieName = process.env.COOKIE_NAME || 'easy_token';
  res.cookie(cookieName, token, cookieOptions());
}

// Register worker (supports multipart/form-data or JSON)
router.post(
  '/register-worker',
  optionalAuth, // Check if user is already logged in
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      const body = req.body && Object.keys(req.body).length ? req.body : {};
      // If client sends JSON, multer won't run; Express json will be used.
      const raw = req.is('application/json') ? req.body : body;

      const parsed = registerWorkerSchema.parse(raw);

      let existing = null;

      // If user is already authenticated, use that user
      if (req.user) {
        existing = await User.findById(req.user.id);
        if (!existing) {
          return res.status(401).json({ success: false, error: 'User not found. Please login again.' });
        }
        // Verify the email matches
        if (existing.email.toLowerCase() !== parsed.email.toLowerCase()) {
          return res.status(400).json({
            success: false,
            error: 'Email does not match your logged-in account. Please use the email associated with your account.'
          });
        }
      } else {
        // User is not authenticated, check if user exists by email
        existing = await User.findOne({ email: parsed.email.toLowerCase() });

        // If user doesn't exist, they must register as client first
        if (!existing) {
          return res.status(400).json({
            success: false,
            error: 'Please register as a client first. You need a client account before becoming a worker.'
          });
        }

        // Verify password if user has one (for non-OAuth users)
        if (existing.passwordHash) {
          const passwordOk = await existing.verifyPassword(parsed.password);
          if (!passwordOk) {
            return res.status(401).json({ success: false, error: 'Invalid password. Please use the correct password for your account.' });
          }
        } else {
          // For OAuth users without password, require them to be logged in
          return res.status(400).json({
            success: false,
            error: 'Please login first, then register as a worker from your account.'
          });
        }
      }

      // If user already has a worker profile, return error
      if (existing.worker) {
        return res.status(409).json({
          success: false,
          error: 'You already have a worker profile. Please login to access your worker dashboard.'
        });
      }

      const files = req.files || {};
      const cnicImages = [];
      if (files.cnicFront?.[0]) cnicImages.push(files.cnicFront[0].path);
      if (files.cnicBack?.[0]) cnicImages.push(files.cnicBack[0].path);

      const profileImage = files.profileImage?.[0]
        ? files.profileImage[0].path
        : '';

      const selfieImage = files.selfie?.[0]
        ? files.selfie[0].path
        : '';

      const skills = Array.isArray(parsed.skills)
        ? parsed.skills
        : typeof parsed.skills === 'string'
          ? parsed.skills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
          : [];

      const worker = await Worker.create({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        whatsapp: parsed.whatsapp,
        city: parsed.city,
        locality: parsed.locality,
        category: parsed.category,
        experience: parsed.experience,
        skills,
        about: parsed.about,
        cnicNumber: parsed.cnicNumber,
        cnicImages,
        selfieImage,
        profileImage,
        isVerified: false,
        verificationStatus: 'pending',
        pendingCnicUpdate: true,
        isActive: true
      });

      // Add worker profile to existing user and update role to 'worker'
      // Keep the client profile if it exists
      existing.worker = worker._id;
      existing.role = 'worker'; // Update role to worker, but client profile is still accessible
      await existing.save();

      // Only set new token if user wasn't already authenticated
      if (!req.user) {
        const token = signToken({ sub: existing._id.toString(), role: existing.role });
        setAuthCookie(res, token);
      }

      return res.json({ success: true, workerId: worker._id });
    } catch (err) {
      return next(err);
    }
  }
);

// Upload verification documents (CNIC + Selfie)
router.post(
  '/upload-verification',
  auth,
  requireRole('worker'),
  upload.fields([
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      const workerId = req.user.worker;
      if (!workerId) return res.status(404).json({ error: 'Worker not found' });

      const worker = await Worker.findById(workerId);
      if (!worker) return res.status(404).json({ error: 'Worker not found' });

      const files = req.files || {};
      const updates = {};

      // Update CNIC images if provided
      if (files.cnicFront?.[0] || files.cnicBack?.[0]) {
        const cnicImages = [...(worker.cnicImages || [])];
        if (files.cnicFront?.[0]) {
          cnicImages[0] = files.cnicFront[0].path;
        }
        if (files.cnicBack?.[0]) {
          cnicImages[1] = files.cnicBack[0].path;
        }
        updates.cnicImages = cnicImages;
      }

      // Update selfie if provided
      if (files.selfie?.[0]) {
        updates.selfieImage = files.selfie[0].path;
      }

      // Set verification status to pending
      updates.verificationStatus = 'pending';
      updates.isVerified = false;
      updates.pendingCnicUpdate = true;
      updates.verifiedAt = null;

      const updatedWorker = await Worker.findByIdAndUpdate(workerId, updates, { new: true });
      return res.json({ success: true, worker: updatedWorker });
    } catch (err) {
      return next(err);
    }
  }
);

// Update worker profile
router.post(
  '/update-worker-profile',
  auth,
  requireRole('worker'),
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      const workerId = req.user.worker;
      if (!workerId) return res.status(404).json({ error: 'Worker not found' });

      const body = req.body && Object.keys(req.body).length ? req.body : {};
      const updates = { ...body };

      const files = req.files || {};

      // Handle profile image update
      if (files.profileImage?.[0]) {
        updates.profileImage = files.profileImage[0].path;
      }

      // Handle selfie update
      if (files.selfie?.[0]) {
        updates.selfieImage = files.selfie[0].path;
        updates.verificationStatus = 'pending';
        updates.isVerified = false;
        updates.pendingCnicUpdate = true;
        updates.verifiedAt = null;
      }

      // Handle CNIC update
      if (files.cnicFront?.[0] || files.cnicBack?.[0]) {
        const worker = await Worker.findById(workerId);
        const cnicImages = [...(worker.cnicImages || [])];
        if (files.cnicFront?.[0]) {
          cnicImages[0] = files.cnicFront[0].path;
        }
        if (files.cnicBack?.[0]) {
          cnicImages[1] = files.cnicBack[0].path;
        }
        updates.cnicImages = cnicImages;

        // CNIC update triggers re-verification
        updates.verificationStatus = 'pending';
        updates.isVerified = false;
        updates.pendingCnicUpdate = true;
        updates.verifiedAt = null;
      }

      // Any profile update triggers re-verification as in frontend
      // unless it's just a view/click count update (not applicable here)
      updates.isVerified = false;
      updates.verifiedAt = null;
      updates.verificationStatus = 'pending';

      // Parse skills if it's a string
      if (updates.skills && typeof updates.skills === 'string') {
        updates.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
      }

      // Ensure locality is an array
      if (updates.locality) {
        updates.locality = Array.isArray(updates.locality) ? updates.locality : [updates.locality];
      }

      // Parse experience if it's a string
      if (updates.experience) {
        updates.experience = Number(updates.experience);
      }

      const worker = await Worker.findByIdAndUpdate(workerId, updates, { new: true });
      if (!worker) return res.status(404).json({ error: 'Worker not found' });

      return res.json({ success: true, worker });
    } catch (err) {
      return next(err);
    }
  }
);

// Help & Support route
router.post('/support', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const newMessage = await SupportMessage.create({
      name,
      email,
      phone,
      subject,
      message
    });

    return res.json({ success: true, message: 'Support message sent successfully', data: newMessage });
  } catch (err) {
    return next(err);
  }
});

// Public: list workers by category/city/locality (only verified + active package)
router.get('/workers', async (req, res, next) => {
  try {
    const { category, city, locality } = req.query;
    const filter = {};
    if (category) filter.category = String(category);
    if (city) filter.city = String(city);
    if (locality) {
      // Support both single locality and array of localities
      const localityStr = String(locality);
      filter.locality = { $in: [localityStr] }; // Use $in to match any locality in the array
    }
    filter.isVerified = true;
    filter.hasPurchasedPackage = true;
    filter.isActive = true;
    filter.$or = [{ packageExpiry: null }, { packageExpiry: { $gte: new Date() } }];

    const workers = await Worker.find(filter).sort({ packageType: -1, rating: -1 });
    return res.json({ success: true, workers });
  } catch (err) {
    return next(err);
  }
});

// Public: worker profile
router.get('/workers/:id', async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, worker });
  } catch (err) {
    return next(err);
  }
});

// Public: list reviews for a worker
router.get('/workers/:id/reviews', async (req, res, next) => {
  try {
    const workerId = req.params.id;
    if (!workerId || !mongoose.Types.ObjectId.isValid(workerId)) {
      console.warn('Invalid worker id in GET /workers/:id/reviews:', {
        workerId,
        type: typeof workerId,
        url: req.originalUrl
      });
      return res.status(400).json({ error: 'Invalid worker id' });
    }

    const reviews = await Review.find({ worker: workerId })
      .sort({ createdAt: -1 })
      .populate({ path: 'client', select: 'name profileImage' })
      .lean();

    return res.json({ success: true, reviews });
  } catch (err) {
    return next(err);
  }
});

// Auth: create a review for a worker (users with client profile only)
router.post('/workers/:id/reviews', auth, async (req, res, next) => {
  try {
    const schema = z.object({
      rating: z.coerce.number().int().min(1).max(5),
      text: z.string().max(2000).optional().default('')
    });
    const { rating, text } = schema.parse(req.body);

    const workerId = req.params.id;
    const clientId = req.user.client;

    if (!workerId || !mongoose.Types.ObjectId.isValid(workerId)) {
      console.warn('Invalid worker id in POST /workers/:id/reviews:', {
        workerId,
        type: typeof workerId,
        clientId,
        url: req.originalUrl,
        body: req.body
      });
      return res.status(400).json({ error: 'Invalid worker id' });
    }

    // Check if user has a client profile (required to review)
    if (!clientId) {
      return res.status(403).json({ error: 'You need a client account to review workers. Please register as a client first.' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    const existing = await Review.findOne({ worker: workerId, client: clientId });
    if (existing) return res.status(409).json({ error: 'You have already reviewed this worker' });

    const review = await Review.create({ worker: workerId, client: clientId, rating, text });

    // Recompute aggregate rating and count
    const stats = await Review.aggregate([
      { $match: { worker: worker._id } },
      { $group: { _id: '$worker', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats && stats.length) {
      const avg = Math.round(stats[0].avg * 10) / 10; // One decimal place
      const count = stats[0].count;
      worker.rating = avg;
      worker.reviewCount = count;
      await worker.save();
    }

    const populated = await Review.findById(review._id).populate({ path: 'client', select: 'name profileImage' }).lean();

    return res.json({ success: true, review: populated, rating: worker.rating, reviewCount: worker.reviewCount });
  } catch (err) {
    // Handle duplicate key error gracefully
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'You have already reviewed this worker' });
    }
    return next(err);
  }
});

// Public: featured workers (premium)
router.get('/workers-featured', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '6', 10), 50);
    const workers = await Worker.find({
      isVerified: true,
      hasPurchasedPackage: true,
      isActive: true,
      packageType: 'premium',
      $or: [{ packageExpiry: null }, { packageExpiry: { $gte: new Date() } }]
    })
      .sort({ rating: -1 })
      .limit(limit);

    return res.json({ success: true, workers });
  } catch (err) {
    return next(err);
  }
});

// Auth: check if logged-in user has worker profile
router.get('/check-worker-profile', auth, async (req, res) => {
  // Check if user has a worker profile (regardless of role, since users can be clients first)
  if (!req.user.worker) {
    return res.json({ hasProfile: false });
  }
  return res.json({ hasProfile: true, workerId: req.user.worker });
});

module.exports = router;
