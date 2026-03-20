/**
 * Axios HTTP Client Configuration
 *
 * Configures a shared Axios instance with:
 * - Base URL from environment
 * - JWT token injection via request interceptor
 * - Automatic token refresh on 401 responses
 * - Standardized error handling
 */
import axios from "axios";

function resolveApiBaseUrl() {
  const raw = (process.env.REACT_APP_API_URL || "").trim();
  if (!raw) return "/api";

  // Same-origin path (e.g. CRA dev proxy / nginx): must include /api if that is your mount.
  if (raw.startsWith("/")) {
    return raw.replace(/\/+$/, "") || "/api";
  }

  let url = raw;
  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  // Railway misconfigs often omit the scheme; axios then treats the host as a *path* on the
  // frontend origin (see logs: GET /techzone-production-....railway.app/categories).
  if (!/^https?:\/\//i.test(url)) {
    const isLocal =
      /^localhost\b/i.test(url) || /^127\.\d+\.\d+\.\d+\b/.test(url);
    if (
      isLocal ||
      /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}/i.test(url)
    ) {
      url = `${isLocal ? "http://" : "https://"}${url}`;
    }
  }

  if (!/^https?:\/\//i.test(url)) {
    return raw;
  }

  const normalized = url.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

const API_BASE_URL = resolveApiBaseUrl();

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: attach the JWT access token to every request.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Track whether a token refresh is already in progress to prevent
 * multiple concurrent refresh requests.
 */
let isRefreshing = false;
let failedRequestQueue = [];

const processQueue = (error, token = null) => {
  failedRequestQueue.forEach((pending) => {
    if (error) {
      pending.reject(error);
    } else {
      pending.resolve(token);
    }
  });
  failedRequestQueue = [];
};

/**
 * Response interceptor: handle 401 errors by attempting a token refresh.
 *
 * If the access token is expired, sends the refresh token to obtain a new
 * access token. Queues any concurrent 401 requests to be retried after
 * the refresh completes.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and not for the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      if (isRefreshing) {
        // Queue this request until the refresh completes
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        isRefreshing = false;
        clearAuthTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newToken = data.access_token;
        localStorage.setItem("access_token", newToken);

        axiosClient.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Remove authentication tokens from local storage.
 */
function clearAuthTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/**
 * Store authentication tokens in local storage.
 *
 * @param {string} accessToken - JWT access token.
 * @param {string} refreshToken - JWT refresh token.
 */
export function setAuthTokens(accessToken, refreshToken) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);
}

export { clearAuthTokens };
export default axiosClient;
