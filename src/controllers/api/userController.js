import asyncHandler from "express-async-handler";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../../services/userService.js";

// Register User
export const registerUserController = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password, referralCode } = req.body;
    const profileImage = req.file ? `/images/products/${req.file.filename}` : null;

    const userData = { firstName, lastName, email, password, referralCode, profileImage};
    
    const response = await registerUser(userData);
    res.success(response, "User registered successfully");
  } catch (error) {
    res.error(error);
  }
});


// Login User
export const loginUserController = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser(email, password, req);
    res.success(response, "Login successful");
  } catch (error) {
    res.error(error);
  }
});

// Get User Profile
export const getUserProfileController = asyncHandler(async (req, res) => {
  try {
    const response = await getUserProfile(req.user.id);
    res.success(response, "User profile fetched successfully");
  } catch (error) {
    res.error(error);
  }
});

// Update User Profile
export const updateUserProfileController = asyncHandler(async (req, res) => {
  try {
    const response = await updateUserProfile(req.user.id, req.body);
    res.success(response, "Profile updated successfully");
  } catch (error) {
    res.error(error);
  }
});

// Change Password
export const changeUserPasswordController = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const response = await changeUserPassword(
      req.user.id,
      oldPassword,
      newPassword
    );
    res.success(response, "Password updated successfully");
  } catch (error) {
    res.error(error);
  }
});
