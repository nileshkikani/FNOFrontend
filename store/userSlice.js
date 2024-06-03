import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail:''
  };

  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setEmail: (state, action) => {
        state.userEmail = action.payload;
      } 
    },
  });

export const { setEmail } = userSlice.actions;
export const userReducer = userSlice.reducer;