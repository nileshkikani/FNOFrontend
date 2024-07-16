import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userEmail:'',
    expiries:[],
    socketToken:'',
    hello:''
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
      },
      setHello:(state,action)=>{
        state.hello = action.payload;
      }
    },
  });

export const { setEmail,setExpiryDates,setSocketToken,setHello } = userSlice.actions;
export const userReducer = userSlice.reducer;