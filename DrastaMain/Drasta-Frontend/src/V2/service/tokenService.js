import axios from "axios";

class TokenService {
  constructor() {
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  get accessToken() {
    return (
      localStorage
        .getItem("accessToken")
        ?.replace(/^Bearer\s+/, "") ?? null
    );
  }

  get refreshToken() {
    return (
      localStorage
        .getItem("refreshToken")
        ?.replace(/^Bearer\s+/, "") ?? null
    );
  }

  setTokens({ accessToken, refreshToken }) {
    localStorage.setItem("accessToken", `Bearer ${accessToken}`);
    localStorage.setItem("refreshToken", `Bearer ${refreshToken}`);
  }

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  refresh() {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = axios
      .post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.refreshToken}`,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        const { accessToken, refreshToken } = res.data;
        this.setTokens({ accessToken, refreshToken });
        return accessToken;
      })
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }
}

export default new TokenService();