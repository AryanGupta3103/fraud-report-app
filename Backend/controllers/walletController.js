const RiskModel = require('../models/RiskModel');
const { sendEmailAlert, sendWebhookAlert } = require('../utils/alertService');

const flagWallet = async (req, res) => {
  try {
    const { wallet } = req.body;
    const lowerWallet = wallet.toLowerCase();

    // Sample logic to assign a risk score (replace with actual logic)
    const riskScore = Math.floor(Math.random() * 100);

    // Save or update wallet record in DB
    let riskEntry = await RiskModel.findOneAndUpdate(
      { wallet: lowerWallet },
      { riskScore, flagged: riskScore >= 70 },
      { new: true, upsert: true }
    );

    // ALERT condition — only for high risk (>= 80)
    if (riskScore >= 80) {
      await sendEmailAlert(lowerWallet, riskScore);
      await sendWebhookAlert(lowerWallet, riskScore);
    }

    return res.status(200).json({
      message: 'Wallet evaluated and stored',
      wallet: lowerWallet,
      riskScore,
      alertSent: riskScore >= 80,
    });
  } catch (error) {
    console.error('Flag wallet error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { flagWallet };
