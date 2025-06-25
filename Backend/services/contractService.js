const { contract } = require('../blockchain/contract');

// Flag wallet and return transaction hash
async function flagWallet(addressToFlag) {
  try {
    const tx = await contract.flagWallet(addressToFlag); // or whatever the function is called
    await tx.wait(); // Wait for confirmation
    return { success: true, txHash: tx.hash };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get report count from chain
async function getOnChainReportCount(walletAddress) {
  try {
    const count = await contract.getReportCount(walletAddress); // adapt to ABI method
    return { success: true, count: Number(count) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  flagWallet,
  getOnChainReportCount,
};
