import asyncHandler from "express-async-handler";
// import upload from "../../middlewares/uploadMiddleware.js";
import { createKycService } from "../../services/kycService.js";

// Middleware for handling file uploads
// const kycUpload = upload("kyc").fields([
//   { name: "documentFront", maxCount: 1 },
//   { name: "documentBack", maxCount: 1 },
//   { name: "verificationFile", maxCount: 1 },
// ]);

// Register KYC
export const createKyc = asyncHandler(async (req, res) => {
  kycUpload(req, res, async (err) => {
    if (err) {
      return res.error(err.message || "File upload failed");
    }

    try {
      const files = req.files;
      const kycData = {
        ...req.body,
        documentFront: files?.documentFront?.[0]?.path,
        documentBack: files?.documentBack?.[0]?.path,
        verificationFile: files?.verificationFile?.[0]?.path,
      };

      const response = await createKycService(kycData);
      res.success(response, "KYC submitted successfully");
    } catch (error) {
      res.error(error);
    }
  });
});

// Get KYC by User ID
export const getKycDetails = asyncHandler(async (req, res) => {
  const response = await getKycByUserId(req.params.userId);
  res.success(response, "KYC details fetched successfully");
});

// Update KYC Status
export const updateKyc = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const response = await updateKycStatus(req.params.kycId, status, adminNotes);
  res.success(response, "KYC status updated successfully");
});

// Get All KYCs (Paginated)
export const getKycs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const response = await getAllKycs(parseInt(page), parseInt(limit), status);
  res.success(response, "KYC records retrieved successfully");
});

// Remove KYC
export const removeKyc = asyncHandler(async (req, res) => {
  await deleteKyc(req.params.kycId);
  res.success({}, "KYC record deleted successfully");
});
