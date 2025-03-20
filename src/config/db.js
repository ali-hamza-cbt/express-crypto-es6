import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?${process.env.MONGO_OPTIONS}&appName=${process.env.MONGO_APP_NAME}`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail if server doesn't respond in 5s
      socketTimeoutMS: 45000, // If query takes >45s, timeout
      maxPoolSize: 1000, // Allow 1000 concurrent connections
      minPoolSize: 50, // Keep 50 open connections always
      heartbeatFrequencyMS: 10000, // Check MongoDB health every 10s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);

    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
