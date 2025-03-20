import { body } from "express-validator";
import KycModel from "../models/KycModel";

export const kycValidationRules = [
  body("_id")
    .optional()
    .custom(async (value) => {
      if (value) {
        const kyc = await KycModel.findById(value);
        if (!kyc) {
          throw new Error("KYC record not found");
        }
      }
    }),
  body("fullName").notEmpty().withMessage("Full name is required").trim(),
  body("dateOfBirth").isISO8601().withMessage("Invalid date format"),
  body("documentType")
    .isIn(["passport", "id_card", "driver_license"])
    .withMessage("Invalid document type"),
  body("documentNumber").notEmpty().withMessage("Document number is required"),
  body("walletType")
    .isIn([
      "MetaMask",
      "Coinbase Wallet",
      "Phantom",
      "Trust Wallet",
      "ZenGo",
      "Crypto.com Onchain",
      "Crypto.com DeFi Wallet",
      "Guarda",
    ])
    .withMessage("Invalid wallet type"),
  body("walletAddress").notEmpty().withMessage("Wallet address is required"),

  // Images: Required if _id is missing, optional if _id is provided
  body("documentFront").custom((value, { req }) => {
    if (!req.body._id && (!req.files?.documentFront || req.files.documentFront.length === 0)) {
      throw new Error("Front side document is required");
    }
    return true;
  }),

  body("documentBack").custom((value, { req }) => {
    if (!req.body._id && (!req.files?.documentBack || req.files.documentBack.length === 0)) {
      throw new Error("Back side document is required");
    }
    return true;
  }),

  body("verificationFile").custom((value, { req }) => {
    if (!req.body._id && (!req.files?.verificationFile || req.files.verificationFile.length === 0)) {
      throw new Error("Verification file is required");
    }
    return true;
  }),
];
