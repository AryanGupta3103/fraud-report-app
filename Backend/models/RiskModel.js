// models/RiskModel.js
const mongoose = require('mongoose');

const RiskSchema = new mongoose.Schema({
  wallet: String,
  riskLevel: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Risk", RiskSchema);
