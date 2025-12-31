const express = require('express');
const { z } = require('zod');
const Worker = require('../models/Worker');

const router = express.Router();

const schema = z.object({
  workerId: z.string().min(1),
  stat: z.enum(['profileViews', 'profileClicks', 'contactClicks', 'whatsappClicks'])
});

router.post('/stats/increment', async (req, res, next) => {
  try {
    const { workerId, stat } = schema.parse(req.body);
    await Worker.findByIdAndUpdate(workerId, { $inc: { [stat]: 1 } });
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
