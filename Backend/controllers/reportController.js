const Report = require('../models/Report');
const calculateRiskLevel = require('../utils/riskCalculator');

exports.submitReport = async (req, res) => {
  try {
    const { wallet, reason, severity } = req.body;
    const report = new Report({ wallet, reason, severity });
    await report.save();
    res.status(201).json({ message: 'Report submitted', report });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { wallet, page = 1, limit = 5 } = req.query;
    const query = wallet ? { wallet } : {};

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, page: Number(page), reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

exports.getWalletRisk = async (req, res) => {
  try {
    const { wallet } = req.params;
    const reports = await Report.find({ wallet });

    const riskLevel = calculateRiskLevel(reports);

    res.json({
      total: reports.length,
      avgSeverity: reports.length
        ? (reports.reduce((a, b) => a + b.severity, 0) / reports.length).toFixed(2)
        : 0,
      recentCount: reports.filter(r => (Date.now() - r.createdAt) < 1000 * 60 * 60 * 24 * 30).length,
      riskLevel,
      reports
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate risk level' });
  }
};
