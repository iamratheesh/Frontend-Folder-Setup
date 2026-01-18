export const removeAuthToken = () => {
  return localStorage.removeItem("auth_token");
};

export const setAuthToken = (token) => {
  return localStorage.setItem("auth_token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

export const setToken = (token) => {
  return sessionStorage.setItem("token", token);
};

export const getToken = () => {
  return sessionStorage.getItem("token");
};

export const removeToken = () => {
  return sessionStorage.removeItem("token");
};

export const setPath = (path) => {
  return sessionStorage.setItem("path", path);
};

export const getPath = () => {
  return sessionStorage.getItem("path");
};
