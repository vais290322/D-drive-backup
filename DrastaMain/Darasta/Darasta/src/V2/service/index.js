import axios from "axios";
import TokenService from "./tokenService";
import { injectStore } from "./storeInjector";
import { authAction } from "../app/features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 1) Attach the access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = TokenService.accessToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2) Handle 401 responses by attempting a single token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config: originalRequest } = error;

    // Only try once per request
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh
        const newAccessToken = await TokenService.refresh();

        // Update Redux state (so UI stays in sync)
        if (injectStore.store) {
          injectStore.store.dispatch(
            authAction.updateTokens({
              accessToken: `Bearer ${newAccessToken}`,
              refreshToken: `Bearer ${TokenService.refreshToken}`,
            })
          );
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh itself 401’d, clear everything and log the user out
        if (refreshError.response?.status === 401) {
          TokenService.clearTokens();
          if (injectStore.store) {
            injectStore.store.dispatch(authAction.logout());
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just propagate
    return Promise.reject(error);
  }
);

export default api;