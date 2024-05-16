import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";



const initialState = {
  authState: "",
  isUser:false,
  isCookie:false,
  logedInTime:"",
  rememberMe:false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
    
      state.authState = action.payload;
    },
    setUserStatus: (state, action) => {
     
      state.isUser = action.payload;
    },
    setUserStatusInitially: (state, action) => {
      
      state.isCookie = action.payload;
    },
    setUserLoginTime: (state, action) => {
     
      state.logedInTime = action.payload;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
  },
});

export const { setAuth,setUserStatus,setUserStatusInitially,setUserLoginTime,setRememberMe } = authSlice.actions;
export const authReducer = authSlice.reducer;
