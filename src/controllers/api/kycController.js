import asyncHandler from "express-async-handler";
import { createKycService } from "../../services/kycService.js";

// Register KYC
export const createKycController = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.error({ message: "User ID is missing from authentication" });
    }

    const kycData = {
      ...req.body,
      userId,
      documentFront: req.files?.documentFront?.[0]?.path || null,
      documentBack: req.files?.documentBack?.[0]?.path || null,
      verificationFile: req.files?.verificationFile?.[0]?.path || null,
    };

    const response = await createKycService(kycData);
    return res.success(response, "KYC submitted successfully");
  } catch (error) {
    return res.error({ message: error.message });
  }
});
