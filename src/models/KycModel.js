import mongoose from "mongoose";

const KycSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    documentType: { type: String, enum: ["passport", "id_card", "driver_license"], required: true },
    documentNumber: { type: String, required: true, unique: true, trim: true },
    documentFront: { type: String, required: true }, // Front side document
    documentBack: { type: String, required: true },  // Back side document
    walletType: { type: String, enum: ["MetaMask", "Coinbase Wallet", "Phantom", "Trust Wallet", "ZenGo", "Crypto.com Onchain", "Crypto.com DeFi Wallet", "Guarda"], required: true },
    walletAddress: { type: String, required: true, index: true },
    verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    verificationFile: { type: String, required: true },
    isWalletVerified: { type: Boolean, default: false },
    adminNotes: { type: String, trim: true }, // Notes for rejection reason or additional comments
    verifiedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Kyc", KycSchema);
