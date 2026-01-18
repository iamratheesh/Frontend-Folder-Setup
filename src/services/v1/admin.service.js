// import config from '@/config/api-config';
// import axiosConfig from '../api/axios.service';
// import { setAuthToken, setToken } from '@/utils/storage';
// import {  setMode, setupAuth } from '@/redux/slice/auth.slice';
// import { store } from '@/redux/store/store';

// export const scrapJobs = async (params = {}) => {
//   try {
//     const queryParams = new URLSearchParams(params).toString()
    
//     const response = await axiosConfig.get(
//       `${config.API_ROOT_ADMIN}/search-jobs?${queryParams}`
//     )
    
//     return response.data
//   } catch (error) {
//     console.error('Error in scrapJobs:', error)
//     return { success: false, error }
//   }
// }
