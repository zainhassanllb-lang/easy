const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const Worker = require('../models/Worker');

const router = express.Router();

router.get('/current-user', optionalAuth, async (req, res) => {
  try {
    if (!req.user) return res.json({ user: null });

    let profileImage = null;
    let profileId = null;
    
    if (req.user.role === 'worker' && req.user.worker) {
      profileId = req.user.worker.toString();
      const worker = await Worker.findById(req.user.worker).select('profileImage');
      profileImage = worker?.profileImage || null;
    } else if (req.user.role === 'client' && req.user.client) {
      profileId = req.user.client.toString();
    }

    return res.json({
      user: {
        id: req.user.id,
        role: req.user.role,
        email: req.user.email,
        profileId,
        profileImage
      }
    });
  } catch (err) {
    return res.json({ user: null });
  }
});

module.exports = router;
