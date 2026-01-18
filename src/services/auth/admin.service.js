// import config from "@/config/api-config";
// import axiosConfig from "../api/axios.service";
// import { setAuthToken, setToken } from "@/utils/storage";
// import { setMode, setupAuth } from "@/redux/slice/auth.slice";
// import { store } from "@/redux/store/store";

// export const adminLogin = async (data, dispatch) => {
//   try {
//     const response = await axiosConfig.post(
//       `${config.AUTH_API_ROOT_ADMIN}/login`,
//       data
//     );

//     if (response.data?.success) {
//       setAuthToken(response.data.accessToken);
//       setToken(response.data.token);

//       dispatch(
//         setupAuth({
//           isAuth: true,
//           role: response.data?.role,
//           token: response.data.accessToken,
//         })
//       );

//       if (response.data.mode) {
//         store.dispatch(setMode({ mode: response.data.mode }));
//       }
//     }

//     return response.data;
//   } catch (error) {
//     console.log("verifyOTP error:", error);
//     return error;
//   }
// };

// export const adminLogout = async () => {
    
//   try {
//       const response = await axiosConfig.post(`${config.AUTH_API_ROOT_ADMIN}/logout`,{},{
//          headers:{
//             "show-toast": "false",
//            "show-loader": "false",
//          }
//       } );
//       return response.data;
//   } catch (error) {
//       return error;
//   }
// }

