class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);  // Set the message property of the base Error class
        this.statusCode = statusCode;
        this.message = message;  // Explicitly set the message property in the ApiError instance
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,  
            data: this.data,
            success: this.success,
            errors: this.errors,
        };
    }
}

export { ApiError };