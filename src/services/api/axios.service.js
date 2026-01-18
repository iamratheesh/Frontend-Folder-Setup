import axios from "axios";
import { getAuthToken, setAuthToken } from "@/utils/storage";
import { setSessionExpired } from "@/redux/slice/auth.slice";
import { store } from "@/redux/store/store";
import { showToast } from "@/utils/toastUtils";
import { refreshToken } from "@/middleware/getCookies";
import env from "@/config/env";
import loaderService from "@/utils/loaderService"; 

const apiUrl = env.API_BASE_URL || "";
const resumeApiUrl = env.API_RESUME_URL || "";

/**
 * Create Axios instance factory (shared between multiple services)
 */
const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "show-toast": "true",
    },
    withCredentials: true,
  });
};

// Main API instance
const axiosConfig = createAxiosInstance(apiUrl);

// Resume API instance
export const aiAxiosConfig = createAxiosInstance(resumeApiUrl);

/**
 * Request interceptor shared setup
 */
const setupRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    (request) => {
      try {
        // Check if loader should be shown (default: true)
        const showLoaderHeader = request.headers?.["show-loader"];
        if (showLoaderHeader !== "false") {
          loaderService.show(); // Show loader for all requests by default
        }

        const token = getAuthToken();
        if (token) {
          request.headers = request.headers || {};
          request.headers["Authorization"] = token;
        }

        if (request.data instanceof FormData) {
          request.headers = request.headers || {};
          request.headers["Content-Type"] = "multipart/form-data";
        }
      } catch (err) {
        console.error("Request interceptor error:", err);
        loaderService.hide(); // Hide loader on error
      }
      return request;
    },
    (error) => {
      loaderService.hide(); // Hide loader on request error
      console.error("Request Error:", error.message);
      return Promise.reject(error);
    }
  );
};

// Apply request interceptor to all instances
setupRequestInterceptor(axiosConfig);
setupRequestInterceptor(aiAxiosConfig);

/**
 * Token refresh queue control
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

/**
 * Get current page URL for return parameter
 */
const getCurrentReturnUrl = () => {
  // Get current path and search params
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  const currentHash = window.location.hash;
  
  // Combine path, search, and hash
  const fullPath = currentPath + currentSearch + currentHash;
  
  // Encode the URL to safely pass it as a query parameter
  return encodeURIComponent(fullPath);
};

const handleSessionExpiration = (originalRequest) => {
  store.dispatch(setSessionExpired());
  const method = (originalRequest?.method || "").toString().toLowerCase();
  if (method !== "get") {
    showToast({ message: "Session expired. Please login again.", severity: "error" });
  }
  
  // Get user role from Redux store and redirect to appropriate login page
  const { role } = store.getState().auth || { role: null };
  const userType = role?.toLowerCase() || "student"; // Default to student if role not found
  
  // Clear authentication data from local storage
  localStorage.removeItem("auth_token");
  localStorage.removeItem("persist:root");
  
  // Get the return URL (current page)
  const returnUrl = getCurrentReturnUrl();
  
  setTimeout(() => {
    // Redirect to login with return URL parameter
    window.location.href = `/${userType}/auth/login?return=${returnUrl}`;
  }, 1000); // 1 second delay to allow toast to be visible
  
  return Promise.reject(new Error("Session expired. Please login again."));
};

const handleTokenRefresh = async (originalRequest) => {
  // Check if access token exists
  const token = getAuthToken();
  if (!token) {
    // No access token found, redirect to login immediately
    return handleSessionExpiration(originalRequest);
  }

  if (originalRequest._refreshAttempted) {
    isRefreshing = false;
    return handleSessionExpiration(originalRequest);
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      if (token) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers["Authorization"] = token;
      }
      return axios(originalRequest);
    }).catch((error) => {
      // If refresh failed for queued requests, redirect to login
      return handleSessionExpiration(originalRequest);
    });
  }

  originalRequest._retry = true;
  originalRequest._refreshAttempted = true;
  isRefreshing = true;

  try {
    const { isAuth, role } = store.getState().auth || { isAuth: false, role: null };
    if (!isAuth) {
      return handleSessionExpiration(originalRequest);
    }

    const newAccessToken = await refreshToken(role);

    if (newAccessToken) {
      setAuthToken(newAccessToken);

      axiosConfig.defaults.headers = axiosConfig.defaults.headers || {};
      aiAxiosConfig.defaults.headers = aiAxiosConfig.defaults.headers || {};

      axiosConfig.defaults.headers["Authorization"] = newAccessToken;
      aiAxiosConfig.defaults.headers["Authorization"] = newAccessToken;

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers["Authorization"] = newAccessToken;

      processQueue(null, newAccessToken);
      return axios(originalRequest);
    } else {
      processQueue(new Error("Failed to refresh token"), null);
      return handleSessionExpiration(originalRequest);
    }
  } catch (err) {
    processQueue(err, null);
    return handleSessionExpiration(originalRequest);
  } finally {
    isRefreshing = false;
  }
};

/**
 * Response interceptor shared setup
 */
const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => {
      loaderService.hide(); // Hide loader on success
      
      if (response.config && response.config.responseType === "blob") {
        return response;
      }

      const showToastMessage = response?.config?.headers?.["show-toast"] !== "false";

      if (response.data?.message && showToastMessage) {
        showToast({ message: response.data.message, severity: "success" });
      }

      return response;
    },
    async (error) => {
      loaderService.hide(); // Hide loader on error
      
      const originalRequest = error.config || {};
      const showToastMessage = originalRequest?.headers?.["show-toast"] !== "false";
      const method = (originalRequest.method || "").toString().toLowerCase();

      if (!originalRequest) {
        if (showToastMessage) {
          showToast({ message: "Network Error: Unable to process request", severity: "error" });
        }
        return Promise.reject(error);
      }

      if (error.response?.data?.isLogout) {
        return handleSessionExpiration(originalRequest);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        return handleTokenRefresh(originalRequest);
      }

      if (error.response?.data && typeof error.response.data === "object" && "errors" in error.response.data) {
        return Promise.reject(error.response.data);
      }

      if (
        error.response?.data &&
        typeof error.response.data === "object" &&
        "mode" in error.response.data &&
        ["2STEP_AUTH", "2FA_AUTH", "RESEND_MAIL", "JOB_WITHDRAW", "CHANGEPASSWORD"].includes(
          error.response.data.mode
        )
      ) {
        return Promise.reject(error.response.data);
      }

      if (error.response) {
        const errorMessage = error.response.data?.message || "An unexpected error occurred.";
        if (method !== "get" && showToastMessage) {
          switch (error.response.status) {
            case 400:
              showToast({ message: errorMessage || "Invalid request.", severity: "error" });
              break;
            case 403:
              showToast({ message: errorMessage || "You don't have permission to access this resource.", severity: "error" });
              break;
            case 404:
              showToast({ message: errorMessage || "The requested resource was not found.", severity: "error" });
              break;
            case 500:
              showToast({ message: errorMessage || "An error occurred on the server.", severity: "error" });
              break;
            default:
              showToast({ message: `${errorMessage}`, severity: "error" });
          }
        }
      } else if (error.request && method !== "get" && showToastMessage) {
        showToast({ message: "Network Error: Please check your network connection.", severity: "error" });
      } else if (method !== "get" && showToastMessage) {
        showToast({ message: `Error: ${error.message}`, severity: "error" });
      }

      // Blob error handling
      try {
        if (originalRequest.responseType === "blob" && error.response && error.response.data) {
          const blob = error.response.data;
          if (typeof Response !== "undefined") {
            try {
              const text = await new Response(blob).text();
              try {
                error.response.data = JSON.parse(text);
              } catch (e) {
                error.response.data = { message: text };
              }
            } catch (e) {
              console.error("Failed to parse blob response", e);
            }
          }
        }
      } catch (e) {
        console.error("Blob handling error:", e);
      }

      return Promise.reject(error);
    }
  );
};

// Apply response interceptors
setupResponseInterceptor(axiosConfig);
setupResponseInterceptor(aiAxiosConfig);

export default axiosConfig;