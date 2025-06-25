const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const verifySupabaseToken = require('../middleware/verifySupabaseToken');

// ✅ POST /api/reports — Create single or multiple reports (Protected)
router.post('/', verifySupabaseToken, async (req, res) => {
  try {
    const payload = req.body;

    // Check if user_email is present
    if (!payload.user_email) {
      return res.status(400).json({ error: 'Missing user_email in request body' });
    }

    // Multiple reports
    if (Array.isArray(payload)) {
      const savedReports = await Report.insertMany(payload);
      return res.status(201).json(savedReports);
    }

    // Single report
    const report = new Report(payload);
    await report.save();
    return res.status(201).json(report);
  } catch (err) {
    console.error('❌ Error saving report(s):', err.message);
    res.status(500).json({ error: 'Failed to create report(s)' });
  }
});

// ✅ GET /api/reports — List reports (filtering, pagination) (Protected)
router.get('/', verifySupabaseToken, async (req, res) => {
  try {
    const { wallet, severity, fromDate, toDate, page = 1, limit = 10, user_email } = req.query;

    if (!user_email) {
      return res.status(400).json({ error: 'Missing user_email in query parameters' });
    }

    const query = { user_email };

    if (wallet) query.wallet = wallet;
    if (severity) query.severity = Number(severity);
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [results, total] = await Promise.all([
      Report.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Report.countDocuments(query),
    ]);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      results,
    });
  } catch (err) {
    console.error('❌ Error fetching reports:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
