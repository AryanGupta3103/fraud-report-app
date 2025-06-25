const { ethers } = require('ethers');
const { providerUrl, privateKey, contractAddress, contractABI } = require('../config');

const provider = new ethers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

module.exports = { contract, provider };
