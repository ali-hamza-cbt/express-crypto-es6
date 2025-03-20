import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import apiResponse from "./middlewares/apiResponseMiddleware.js";

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Custom Middleware for API Responses
app.use(apiResponse);

// Use Routes
app.use("/api", routes);

export default app;
