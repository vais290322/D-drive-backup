class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture stack trace (optional but useful for debugging)
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;