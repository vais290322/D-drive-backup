import axios from "axios";
import toastUtil from "@/shared/utils/toast";

const REQUEST_TIMEOUT = 15000;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.0.123:5000",
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const isCancelError = (error) => {
  return (
    axios.isCancel(error) ||
    error.name === "CanceledError" ||
    error.code === "ERR_CANCELED"
  );
};

const isNetworkError = (error) => {
  return (
    !error.response &&
    !isCancelError(error) &&
    (error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error")
  );
};

const isRetriableError = (error) => {
  if (isCancelError(error)) return false;
  if (isNetworkError(error)) return true;
  if (!error.response) return true;

  const status = error.response.status;
  return status >= 500 || status === 429;
};

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
apiClient.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(
        `[API Response] ✓ ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
      );
    }

    return response;
  },
  (error) => {
    // 1. Handle CanceledError (Silently)
    if (isCancelError(error)) {
      if (import.meta.env.DEV) {
        console.log(`[API Request Canceled] ${error.config?.url}`);
      }
      return Promise.reject(error);
    }

    // 2. Handle Network Errors
    if (isNetworkError(error)) {
      console.error("[API Network Error]", error.config?.url);
      if (!error.config?._networkErrorShown) {
        toastUtil.error(
          "Unable to connect to server. Please check your connection.",
        );
        if (error.config) error.config._networkErrorShown = true;
      }
      return Promise.reject({ ...error, isNetworkError: true });
    }

    // 3. Handle Timeout Errors
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.error("[API Timeout Error]", error.config?.url);
      toastUtil.error("Request timed out. Please try again.");
      return Promise.reject({ ...error, isTimeout: true });
    }

    // 4. Handle HTTP Response Errors
    if (error.response) {
      const { status, data } = error.response;
      const url = error.config?.url;
      const config = error.config || {};

      // Suppress console logging if silent requested
      if (import.meta.env.DEV && !config.silent) {
        console.error(`[API Error] ✗ ${status} ${url}`, {
          error: data,
          config: config,
        });
      }

      // Suppress toasts if noToast requested
      const shouldToast = !config.noToast;

      // Priority-based error message extraction
      let errorMessage = "";

      // If data is a string (HTML error page from Express)
      if (typeof data === "string" && data.includes("<!DOCTYPE html>")) {
        errorMessage = "Something went wrong on the server. Please try again.";
      } else {
        errorMessage =
          data?.message || data?.error?.message || data?.error || "";
      }

      switch (status) {
        case 400:
          if (shouldToast) {
            toastUtil.error(
              errorMessage || "Invalid request. Please check your inputs.",
            );
          }
          break;

        case 401:
          if (localStorage.getItem("authToken")) {
            localStorage.removeItem("authToken");
            if (shouldToast)
              toastUtil.error("Session expired. Please login again.");
            window.location.href = "/login";
          } else {
            if (shouldToast)
              toastUtil.error(errorMessage || "Please login to continue.");
          }
          break;

        case 403:
          if (shouldToast) {
            toastUtil.error(
              errorMessage || "Access denied. You don't have permission.",
            );
          }
          break;

        case 404:
          if (shouldToast) {
            toastUtil.error(
              errorMessage || "The requested resource was not found.",
            );
          }
          break;

        case 500:
          if (import.meta.env.DEV && !config.silent)
            console.error("[API 500] Server Error:", data);
          if (shouldToast)
            toastUtil.error("Server error. Please try again later.");
          break;

        default:
          if (shouldToast)
            toastUtil.error(errorMessage || "An unexpected error occurred.");
          break;
      }

      error.retriable = isRetriableError(error);
    }

    return Promise.reject(error);
  },
);

// ============================================================
// HELPER: Create cancelable request
// ============================================================
export const createCancelableRequest = (requestFn) => {
  const controller = new AbortController();
  const promise = requestFn(controller.signal);

  return {
    promise,
    cancel: () => controller.abort(),
  };
};

// ============================================================
// EXPORT
// ============================================================
export default apiClient;
export { isCancelError, isNetworkError, isRetriableError };
