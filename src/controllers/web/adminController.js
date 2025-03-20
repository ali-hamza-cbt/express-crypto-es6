import asyncHandler from "express-async-handler";
import { 
  adminLogin, 
  getAllUsers, 
  getUserById, 
  updateUserByAdmin, 
  deleteUser, 
  changeUserStatus 
} from "../services/adminService.js";

// Admin Login
export const adminLoginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminLogin(email, password);
  res.status(200).json({ message: "Admin login successful", admin });
});

// Get all users
export const getAllUsersController = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.status(200).json(users);
});

// Get user by ID
export const getUserByIdController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  res.status(200).json(user);
});

// Update user
export const updateUserByAdminController = asyncHandler(async (req, res) => {
  const user = await updateUserByAdmin(req.params.id, req.body);
  res.status(200).json({ message: "User updated successfully", user });
});

// Delete user
export const deleteUserController = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});

// Change user status
export const changeUserStatusController = asyncHandler(async (req, res) => {
  const user = await changeUserStatus(req.params.id, req.body.status);
  res.status(200).json({ message: "User status updated successfully", user });
});
