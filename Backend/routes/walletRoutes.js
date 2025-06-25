const express = require('express');
const router = express.Router();
const { flagWallet, getOnChainReportCount } = require('../services/contractService');
const Transaction = require('../models/Transaction');

router.post('/flag', async (req, res) => {
  const { walletAddress } = req.body;
  const txResult = await flagWallet(walletAddress);

  if (txResult.success) {
    await Transaction.create({
      walletAddress,
      txHash: txResult.txHash,
      status: 'Success',
    });
    res.json({ message: 'Wallet flagged', txHash: txResult.txHash });
  } else {
    await Transaction.create({
      walletAddress,
      txHash: null,
      status: 'Failed: ' + txResult.error,
    });
    res.status(500).json({ error: txResult.error });
  }
});

router.get('/report-count/:address', async (req, res) => {
  const result = await getOnChainReportCount(req.params.address);
  if (result.success) res.json({ count: result.count });
  else res.status(500).json({ error: result.error });
});

module.exports = router;
