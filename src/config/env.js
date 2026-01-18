const env = {
  ENV: import.meta.env.VITE_APP_ENV,
  API_BASE_URL: import.meta.env.VITE_APP_API_BACKEND_URL,
  API_RESUME_URL: import.meta.env.VITE_APP_API_RESUME_URL,
  FRONTEND_URL: import.meta.env.VITE_APP_FRONTEND_URL,
  DEBUG: import.meta.env.VITE_APP_DEBUG === "true",
};

export default env;
