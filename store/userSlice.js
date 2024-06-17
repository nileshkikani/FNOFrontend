import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail:'',
    expiries:[]
  };

  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setEmail: (state, action) => {
        state.userEmail = action.payload;
      },
      setExpiryDates:(state,action) =>{
        // console.log("exppppp",action.payload)
        state.expiries = action.payload;
      }
    },
  });

export const { setEmail,setExpiryDates } = userSlice.actions;
export const userReducer = userSlice.reducer;