import express from "express";
import userRoutes from "./api/userRoutes.js";
import kycRoutes from "./api/kycRoutes.js";

const router = express.Router();

// API Routes
router.use("/user", userRoutes);
router.use("/kyc", kycRoutes);

// Web Routes
// router.use("/", homeRoutes);

export default router;
