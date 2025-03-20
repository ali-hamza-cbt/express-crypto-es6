import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UAParser } from "ua-parser-js"; // Correct import for ua-parser-js
import geoip from "geoip-lite";
import axios from "axios";
import moment from "moment-timezone";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const { Schema, model } = mongoose;

// Get timezone from environment variables
const APP_TIMEZONE = process.env.APP_TIMEZONE || "UTC";

// Function to get the current date in the specified timezone
const getCurrentDate = () => moment().tz(APP_TIMEZONE).toDate();

// Schema for storing login logs
const LoginLogSchema = new Schema({
  ipAddress: { type: String },
  device: { type: String },
  browser: { type: String },
  os: { type: String },
  location: { type: String }, // City, region, country
  timezone: { type: String },
  loginTime: { type: Date, default: getCurrentDate },
});

// Define User Schema
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // Hidden by default
    referralCode: { type: String, unique: true, sparse: true, default: null },
    referredBy: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: getCurrentDate }, // Apply timezone
    loginLogs: [LoginLogSchema], // Store all login logs
    preferences: {
      notifications: { type: Boolean, default: true },
      twoFactorAuth: { type: Boolean, default: false },
      twoFactorAuthMethod: {
        type: String,
        enum: ["sms", "email", "authenticator"],
        default: "email",
      },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      language: { type: String, default: "en" },
      currency: { type: String, default: "USD" },
      timezone: { type: String, default: APP_TIMEZONE }, // Store user's preferred timezone
      autoLogout: { type: Number, default: 30 },
      emailPromotions: { type: Boolean, default: true },
    },
  },
  { 
    timestamps: { 
      currentTime: getCurrentDate, // Ensure timestamps use the correct timezone
    }
  }
);

// Virtual field for full name
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Function to log login details
UserSchema.methods.logLoginDetails = async function (req) {
  this.lastLogin = getCurrentDate(); // Apply timezone

  // Get IP address
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Use predefined IP if working locally
  if (process.env.LOCAL_IP && process.env.NODE_ENV === "development") {
    ip = process.env.LOCAL_IP;
  }

  // Fetch location details from ipinfo.io
  let locationData = { city: "Unknown", region: "Unknown", country: "Unknown", timezone: APP_TIMEZONE };
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_API_KEY}`);
    locationData = response.data;
  } catch (error) {
    console.error("Error fetching location data:", error.message);
  }

  // Fallback to geoip-lite if ipinfo.io fails
  if (!locationData.city || locationData.city === "Unknown") {
    const geo = geoip.lookup(ip);
    if (geo) {
      locationData.city = geo.city || "Unknown";
      locationData.region = geo.region || "Unknown";
      locationData.country = geo.country || "Unknown";
      locationData.timezone = geo.timezone || APP_TIMEZONE;
    }
  }

  // Use UAParser to parse the User-Agent string
  const parser = new UAParser();
  parser.setUA(req.headers["user-agent"] || "");

  const device = parser.getDevice().model || "Unknown";
  const browser = parser.getBrowser().name || "Unknown";
  const os = parser.getOS().name || "Unknown";


  // Add new login log
  this.loginLogs.push({
    ipAddress: ip,
    device: device,
    browser: browser,
    os: os,
    location: `${locationData.city}, ${locationData.region}, ${locationData.country}`,
    timezone: locationData.timezone,
    loginTime: getCurrentDate(),
  });

  await this.save();
};

// Convert object to JSON and remove sensitive fields
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password; // Hide password
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret._id; // Optional: If you don't want `_id`, but usually it's needed
    return ret;
  },
});

// Export User model
const User = model("User", UserSchema);
export default User;
