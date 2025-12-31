const express = require('express');
const Client = require('../models/Client');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/update-client-profile', auth, requireRole('client'), async (req, res, next) => {
  try {
    const clientId = req.user.client;
    if (!clientId) return res.status(404).json({ error: 'Client not found' });

    const client = await Client.findByIdAndUpdate(clientId, req.body, { new: true });
    if (!client) return res.status(404).json({ error: 'Client not found' });

    return res.json({ success: true, client });
  } catch (err) {
    return next(err);
  }
});

router.get('/my-client-profile', auth, requireRole('client'), async (req, res, next) => {
  try {
    const client = await Client.findById(req.user.client);
    return res.json({ success: true, client });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
