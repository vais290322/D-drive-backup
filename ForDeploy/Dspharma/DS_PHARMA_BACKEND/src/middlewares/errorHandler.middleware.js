import ApiError from "../utils/apiError.js";

/**
 * Global error handling middleware
 * Catches all errors and formats them as JSON responses
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If it's not an ApiError, convert it to one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || []);
  }

  // Prepare the response
  const response = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    ...(error.errors.length > 0 && { errors: error.errors }),
    // Include stack trace in development mode
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  // Send JSON response
  res.status(error.statusCode).json(response);
};
