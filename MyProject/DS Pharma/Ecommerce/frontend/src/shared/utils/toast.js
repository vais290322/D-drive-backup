import { toast } from "react-toastify";

/**
 * Professional Toast Notification Utility
 * Handles various types of notifications with consistent styling and behavior.
 */
const toastUtil = {
  success: (message, options = {}) => {
    return toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
      ...options,
      toastId: message,
    });
  },

  error: (message, options = {}) => {
    const isHtml = /<[a-z][\s\S]*>/i.test(message);
    const displayMessage = isHtml
      ? "Something went wrong on the server. Please try again."
      : message || "An unexpected error occurred";

    return toast.error(displayMessage, {
      position: "top-right",
      autoClose: 5000,
      theme: "colored",
      ...options,
      toastId: displayMessage,
    });
  },

  info: (message, options = {}) => {
    return toast.info(message, {
      theme: "colored",
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast.warning(message, {
      theme: "colored",
      ...options,
    });
  },
};

export default toastUtil;
