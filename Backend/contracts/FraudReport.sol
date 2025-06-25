// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FraudReport {
    mapping(address => uint256) public reportCount;
    mapping(address => mapping(address => bool)) public hasReported;

    event WalletFlagged(address indexed reporter, address indexed wallet, uint256 count);

    function flagWallet(address wallet) public {
        require(wallet != msg.sender, "You cannot report yourself");
        require(!hasReported[msg.sender][wallet], "Already reported");

        hasReported[msg.sender][wallet] = true;
        reportCount[wallet] += 1;

        emit WalletFlagged(msg.sender, wallet, reportCount[wallet]);
    }

    function getReportCount(address wallet) public view returns (uint256) {
        return reportCount[wallet];
    }
}

