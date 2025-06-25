const { flagWallet, getReportCount } = require('../services/blockchain');

(async () => {
  const wallet = '0xabc123...'; // change this
  const tx = await flagWallet(wallet);
  console.log("TX Hash:", tx.hash);

  const count = await getReportCount(wallet);
  console.log("onChainReportCount:", count);
})();
//node test/testContract.js
