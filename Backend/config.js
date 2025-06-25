require('dotenv').config();

module.exports = {
  providerUrl: process.env.PROVIDER_URL,
  privateKey: process.env.PRIVATE_KEY,
  contractAddress: process.env.CONTRACT_ADDRESS,
  contractABI: require('./contractABI.json'), // place ABI JSON here
};
