import apiConfig from "@/config/api-config";
import axiosConfig from "@/services/api/axios.service";

export const refreshToken = async () => {
  
  try {
    let res;
    if (role === "admin") {
      res = await axiosConfig.post(`${apiConfig.AUTH_API_ROOT_ADMIN}/refresh-token`);
    } 
    else if (role === "student") {
      res = await axiosConfig.get(`${apiConfig.AUTH_API_ROOT_STUDENT}/refresh-token`);
    } else if (role === "college") {
      res = await axiosConfig.get(`${apiConfig.AUTH_API_ROOT_COLLEGE}/refresh-token`);
    }
    return res?.data?.accessToken || null;
  } catch (error) {
    console.error("Failed to refresh token", error);
  }
};
