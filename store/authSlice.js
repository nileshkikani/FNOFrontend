import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";



const initialState = {
  authState: "",
  isUser:false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      console.log("hello==>>5555",action.payload)
      // return;
      state.authState = action.payload;
    },
    setUserStatus: (state, action) => {
      console.log("hello==>>5555",action)
      // return;
      state.isUser = action.payload;
    },
  },
});

export const { setAuth,setUserStatus } = authSlice.actions;
export const authReducer = authSlice.reducer;
