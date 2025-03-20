import Kyc from "../models/KycModel.js";
import { validateWalletAddress } from "../utils/validateWalletHelper.js";

export const createKycService = async (kycData) => {
  const { userId, documentNumber, walletType, walletAddress } = kycData;

  // Check for existing submissions using atomic operation
  const existingKyc = await Kyc.findOne({ userId }).lean();

  if (existingKyc) {
    throw new Error("User already has a KYC submission");
  }

  // Validate wallet address
  const isValidWallet = await validateWalletAddress(walletType, walletAddress);
  if (!isValidWallet) {
    throw new Error("Invalid wallet address format or non-existent address");
  }

  // Create KYC record
  const kyc = await Kyc.create(kycData);
  return kyc.toObject();
};
