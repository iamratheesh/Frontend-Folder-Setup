import { getStudentUserData } from '@/services/v1/student.service';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  user: null,
  loading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'student/fetchUserData',
  async (_, { rejectWithValue }) => {
    console.log('🚀 fetchUserData thunk started');
    try {
      const response = await getStudentUserData(); // No dispatch needed
      console.log('✅ getUserData response:', response);
      return response.data; // Return just the user data
    } catch (error) {
      console.error('❌ fetchUserData error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch user data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.user = null;
    },
    logout: (state) => {
      state.user = null;
      state.userData = null;
      state.error = null;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        console.log('🔄 fetchUserData.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        console.log('✅ fetchUserData.fulfilled - payload:', action.payload);
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.log('❌ fetchUserData.rejected - error:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.userData = null;
      });
  },
});

export const { loginSuccess, loginFailure, logout, setUserData, clearError } = studentSlice.actions;
export default studentSlice.reducer;