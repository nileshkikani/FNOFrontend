import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail:'',
    expiries:[],
    socketToken:''
  };

  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setEmail: (state, action) => {
        state.userEmail = action.payload;
      },
      setExpiryDates:(state,action) =>{
        state.expiries = action.payload;
      },
      setSocketToken:(state,action)=>{
        state.socketToken = action.payload;
      }
    },
  });

export const { setEmail,setExpiryDates,setSocketToken } = userSlice.actions;
export const userReducer = userSlice.reducer;