import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  role: "",
  token: "",
  sessionExpired: false,
  mode: null,

};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setupAuth: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.sessionExpired = false;
      return state;
    },

    setMode:(state , action)=>{
      state.mode = action.payload.mode;
      return state;
    },
    resetAuth: (state) => {
      state = initialState;
      return state;
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
      return state;
    },
    clearSessionExpired: (state) => {
      state.sessionExpired = false;
      return state;
    },
  },
});

export const { setupAuth,setMode, resetAuth, clearSessionExpired, setSessionExpired } = authSlice.actions;
export default authSlice.reducer;
