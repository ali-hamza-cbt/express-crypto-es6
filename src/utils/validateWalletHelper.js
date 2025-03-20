import dotenv from "dotenv";
import { isAddress, JsonRpcProvider } from "ethers";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

dotenv.config(); // Load environment variables

// Wallet type classification
const EVM_WALLETS = [
  "MetaMask",
  "Coinbase Wallet",
  "Trust Wallet",
  "ZenGo",
  "Crypto.com Onchain",
  "Crypto.com DeFi Wallet",
  "Guarda",
];

const hasActivityChain = false; // Flaf to check activity log
const SOLANA_WALLETS = ["Phantom"];

// Wallet Address Validation
export const validateWalletAddress = async (walletType, walletAddress) => {
  const cleanedAddress = walletAddress.trim();

  try {
    if (!cleanedAddress) throw new Error("Empty wallet address");

    // Solana (Phantom) Validation
    if (SOLANA_WALLETS.includes(walletType)) {
      if (cleanedAddress.length !== 44) {
        throw new Error(
          "Invalid Solana address length (must be 44 characters)"
        );
      }

      // Base58 check
      try {
        bs58.decode(cleanedAddress);
      } catch {
        throw new Error("Invalid characters (non-base58)");
      }

      // Public key validation
      let publicKey;
      try {
        publicKey = new PublicKey(cleanedAddress);
      } catch {
        throw new Error("Invalid Solana address format");
      }

      // On-chain existence check
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const accountInfo = await connection.getAccountInfo(publicKey);
      if (!accountInfo) {
        throw new Error("Address not found on Solana blockchain");
      }

      return true;
    }

    // Ethereum & EVM Chain Validation
    if (EVM_WALLETS.includes(walletType)) {
      if (!isAddress(cleanedAddress)) {
        throw new Error("Invalid EVM address format");
      }

      if (hasActivityChain) {
        // Use Infura for Ethereum blockchain validation
        const provider = new JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.YOUR_INFURA_API_KEY}`);

        // Check if address is a smart contract
        const code = await provider.getCode(cleanedAddress);
        if (code === "0x") {
          // Check for any transactions
          const txCount = await provider.getTransactionCount(cleanedAddress);
          if (txCount === 0) {
            // Final check for any balance
            const balance = await provider.getBalance(cleanedAddress);
            if (balance === 0n) {
              throw new Error("Address has no on-chain activity");
            }
          }
        }
      }
      return true;
    }

    throw new Error("Unsupported wallet type");
  } catch (error) {
    console.error(`Wallet validation failed (${walletType}):`, error.message);
    throw new Error(`Invalid ${walletType} address: ${error.message}`);
  }
};
