import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";



const initialState = {
  authState: "",
  isUser:false,
  isCookie:false,
  logedInTine:""
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
     
      state.logedInTine = action.payload;
    },
  },
});

export const { setAuth,setUserStatus,setUserStatusInitially,setUserLoginTime } = authSlice.actions;
export const authReducer = authSlice.reducer;
