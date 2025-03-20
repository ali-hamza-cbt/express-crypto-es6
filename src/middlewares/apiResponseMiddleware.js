import dotenv from "dotenv";
dotenv.config();

const apiResponse = (req, res, next) => {
  res.success = (data, message = "Success") =>
    res.status(200).json({
      success: true,
      message,
      data,
    });

  res.error = (error, statusCode = error.statusCode || 500) => {
    const isDebug = process.env.APP_DEBUG === "true";

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
      errors: isDebug ? error?.stack || error : {},
    });
  };

  next();
};

export default apiResponse;
