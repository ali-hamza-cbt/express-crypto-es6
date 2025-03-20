import User from "../models/userModel.js";
import { generateReferralCode } from "../utils/referralHelper.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Registers a new user with hashed password and unique referral code.
 * Validates referral code if provided and ensures email is unique.
 * Returns the user object excluding the password.
 */
export const registerUser = async (userData) => {
  const { email, referralCode } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  // Validate referral code if provided
  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      throw new Error("Invalid referral code");
    }
    referredBy = referrer._id;
  }

  // Generate a unique referral code for the new user
  const newReferralCode = await generateReferralCode();

  // Create user
  const user = new User({
    ...userData,
    referralCode: newReferralCode,
    referredBy,
  });

  await user.save();

  // Return complete user object (excluding password for security)
  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

/**
 * Authenticates a user by verifying credentials and generates a JWT token.  
 * Logs login details and returns the user object excluding sensitive fields.
 */
export const loginUser = async (email, password, req) => {
  const user = await User.findOne({ email }).select(
    "+password +preferences.autoLogout"
  );

  if (!user) {
    throw new Error("User not found");
  }

  const autoLogout = `${user.preferences?.autoLogout || 7}d`;


  // Compare passwords
  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: autoLogout }
  );

  // Log login details
  await user.logLoginDetails(req);

  // Convert Mongoose document to a plain JavaScript object
  const userObject = user.toObject();

  // Destructure and exclude sensitive fields
  const { password: _password, _id, createdAt, updatedAt, __v, ...userData } = userObject;

  return { user: userData, token };
};


// Get User Profile
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Update User Profile
export const updateUserProfile = async (userId, userData) => {
  return await User.findByIdAndUpdate(userId, userData, { new: true }).select("-password");
};

// Change Password
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Old password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password updated successfully" };
};
