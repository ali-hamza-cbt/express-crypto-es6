import express from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";
import validate from "../../middlewares/validateMiddleware.js";
import { kycValidationRules } from "../../validationRules/kycValidation.js";
import { createKycController } from "../../controllers/api/kycController.js";

const router = express.Router();

// Middleware for handling file uploads
const kycUpload = upload("kyc").fields([
  { name: "documentFront", maxCount: 1 },
  { name: "documentBack", maxCount: 1 },
  { name: "verificationFile", maxCount: 1 },
]);

// Routes
router.post("/", protect, kycUpload, validate(kycValidationRules), createKycController);
router.post("/update", protect, kycUpload, validate(kycValidationRules), createKycController);

export default router;
