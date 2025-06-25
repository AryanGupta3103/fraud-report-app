const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_PASSWORD,
  },
});

const sendEmailAlert = async (wallet, riskScore) => {
  const mailOptions = {
    from: process.env.ALERT_EMAIL,
    to: process.env.ALERT_RECEIVER,
    subject: '🚨 High-Risk Wallet Detected',
    text: `Wallet ${wallet} flagged with risk score ${riskScore}. Immediate attention needed.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmailAlert };

///Webhook Example (e.g., Discord, Slack)

const axios = require('axios');

const sendWebhookAlert = async (wallet, riskScore) => {
  const payload = {
    content: `🚨 High-Risk Wallet: \`${wallet}\` with score \`${riskScore}\``
  };

  await axios.post(process.env.ALERT_WEBHOOK_URL, payload);
};

module.exports = { sendWebhookAlert };
