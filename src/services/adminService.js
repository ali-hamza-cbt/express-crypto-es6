import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Admin Login
export const adminLogin = async (email, password) => {
  const admin = await User.findOne({ email, role: "admin" }).select("+password");

  if (!admin) {
    throw new Error("Admin not found");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return { id: admin._id, email: admin.email, role: admin.role, token };
};

// Get All Users
export const getAllUsers = async () => {
  return await User.find({ role: "user" }).select("-password");
};

// Get User By ID
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Update User
export const updateUserByAdmin = async (userId, userData) => {
  return await User.findByIdAndUpdate(userId, userData, { new: true }).select("-password");
};

// Delete User
export const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

// Change User Status
export const changeUserStatus = async (userId, status) => {
  return await User.findByIdAndUpdate(userId, { status }, { new: true }).select("-password");
};
