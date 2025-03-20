import Kyc from "../models/KycModel.js";
import { validateWalletAddress } from "../utils/validateWalletHelper.js";

/**
 * Creates a new KYC submission after checking for duplicates.
 * Validates the wallet address before storing.
 */
export const createKycService = async (kycData) => {
  const { userId, documentNumber, walletType, walletAddress } = kycData;

  // Check for existing KYC submissions
  const existingKyc = await Kyc.findOne({
    $or: [{ userId }, { documentNumber }, { walletAddress }],
  });

  if (existingKyc) {
    if (existingKyc.userId.equals(userId))
      throw new Error("User already has a KYC submission");
    if (existingKyc.documentNumber === documentNumber)
      throw new Error("Document number already in use");
    if (existingKyc.walletAddress === walletAddress)
      throw new Error("Wallet address already registered");
  }

  // Validate wallet existence
  const isValidWallet = await validateWalletAddress(walletType, walletAddress);
  if (!isValidWallet) {
    throw new Error("Invalid or non-existent wallet address");
  }

  const kyc = await Kyc.create(kycData);

  // Convert Mongoose document to plain object
  return kyc.toObject();
};

/**
 * Retrieves KYC details for a given user.
 */
export const getKycByUserId = async (userId) => {
  const kyc = await Kyc.findOne({ userId }).populate("userId", "-password");
  if (!kyc) throw new Error("KYC record not found");
  return kyc.toObject();
};

/**
 * Updates KYC verification status and stores admin notes.
 */
export const updateKycStatus = async (kycId, status, adminNotes) => {
  const kyc = await Kyc.findByIdAndUpdate(
    kycId,
    {
      verificationStatus: status,
      adminNotes,
      verifiedAt: status === "verified" ? Date.now() : null,
    },
    { new: true, runValidators: true }
  );

  if (!kyc) throw new Error("KYC record not found");
  return kyc.toObject();
};

/**
 * Retrieves all KYC records with pagination and optional status filter.
 */
export const getAllKycs = async (page = 1, limit = 10, status) => {
  const query = status ? { verificationStatus: status } : {};

  const kycs = await Kyc.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("userId", "firstName lastName email");

  return kycs.map((kyc) => kyc.toObject());
};

/**
 * Deletes a KYC record by ID.
 */
export const deleteKyc = async (kycId) => {
  const kyc = await Kyc.findByIdAndDelete(kycId);
  if (!kyc) throw new Error("KYC record not found");
  return kyc.toObject();
};
