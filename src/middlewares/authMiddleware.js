import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware to authenticate user using JWT
 */
export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing or invalid",
      });
    }

    token = token.split(" ")[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token format is invalid",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    next(); // Proceed to next middleware or controller
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

/**
 * Middleware to restrict access to Admins only
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Allow access
  } else {
    res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin access required" });
  }
};
