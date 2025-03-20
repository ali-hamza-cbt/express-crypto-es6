const { isAddress, verifyMessage } = require("ethers");
const { PublicKey } = require("@solana/web3.js");

/**
 * Middleware to validate wallet address format and optionally verify ownership.
 * Ownership verification can be enabled/disabled via environment variable.
 */
const validateAndVerifyWallet = (req, res, next) => {
  const { walletType, walletAddress, signedMessage } = req.body;
  const verifyOwnership = process.env.VERIFY_WALLET_OWNERSHIP === "true"; // Toggle from .env

  let isValid = false;

  // Validate wallet address format
  if (["MetaMask", "Coinbase Wallet", "Trust Wallet", "Crypto.com Onchain", "Crypto.com DeFi Wallet", "Guarda", "ZenGo"].includes(walletType)) {
    isValid = isAddress(walletAddress);
  } else if (walletType === "Phantom") {
    try {
      new PublicKey(walletAddress);
      isValid = true;
    } catch (error) {
      isValid = false;
    }
  }

  if (!isValid) {
    return res.status(400).json({ message: "Invalid wallet address for the selected wallet type" });
  }

  // Verify wallet ownership if enabled in .env
  if (verifyOwnership && signedMessage) {
    try {
      const message = "Verify wallet ownership for KYC";
      const recoveredAddress = verifyMessage(message, signedMessage);

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(400).json({ message: "Wallet ownership verification failed" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid signature format", error: error.message });
    }
  }

  next();
};

module.exports = validateAndVerifyWallet;
