// Error Handler Utility
// ============================================================
// Centralized error handling and logging

export const errorHandler = {
  // Log error with context
  log: (error, context = '') => {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  },

  // Get user-friendly error message
  getUserMessage: (error) => {
    if (typeof error === 'string') return error;

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.message) {
      return error.message;
    }

    if (error.statusText) {
      return error.statusText;
    }

    return 'An unexpected error occurred. Please try again later.';
  },

  // Handle API error
  handleAPIError: (error, context = '') => {
    const message = errorHandler.getUserMessage(error);
    errorHandler.log(error, context);

    return {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
  },

  // Handle validation error
  handleValidationError: (errors) => {
    const errorMessages = {};
    if (Array.isArray(errors)) {
      errors.forEach((error) => {
        errorMessages[error.field] = error.message;
      });
    } else if (typeof errors === 'object') {
      Object.assign(errorMessages, errors);
    }
    return errorMessages;
  },
};

export default errorHandler;
