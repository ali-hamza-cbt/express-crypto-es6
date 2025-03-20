import express from "express";
import { body } from "express-validator";
import { protect } from "../../middlewares/authMiddleware.js";
import validate from "../../middlewares/validateMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

import {
  registerUserController,
  loginUserController,
  getUserProfileController,
  updateUserProfileController,
  changeUserPasswordController,
} from "../../controllers/api/userController.js";
const router = express.Router();

// Validation rules for user
const userValidationRules = [
  body("firstName").notEmpty().withMessage("First name is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
  body("email").isEmail().withMessage("Please provide a valid email."),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  body("profileImage")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Profile image must be a file.");
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error("Only JPEG, PNG, JPG, and WEBP images are allowed.");
      }

      return true;
    }),
];

// Routes
router.post(
  "/register",
  upload("profileImags").single("profileImage"),
  validate(userValidationRules),
  registerUserController
);
router.post("/login", loginUserController);
router.get("/profile", protect, getUserProfileController);
router.put("/profile", protect, updateUserProfileController);
router.put("/change-password", protect, changeUserPasswordController);

export default router;