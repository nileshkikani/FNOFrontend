"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useReducer } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth, setUserLoginTime, setUserStatus,setUserStatusInitially } from "@/store/authSlice";
import { useAppSelector } from "@/store";
import Cookie from "js-cookie"

export const AuthContext = createContext({});

const initialState = {
  data: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const storeDispatch = useDispatch();
  const { data } = state;
  const authState = useAppSelector((state) => state.auth.authState);
  const LoginTime = useAppSelector((state) => state.auth.logedInTine);

  // ---------LOGIN API CALL---------
  const getData = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post(`${API_ROUTER.LOGIN}`, {
        email: email,
        password: password
      });
      if (response.status === 200) {
        dispatch({
          type: 'SET_DATA',
          payload: response.data
        });
        
         storeDispatch(setAuth({access:response.data?.tokens?.access ?response.data?.tokens?.access : "",refresh: response.data?.tokens?.refresh?response.data?.tokens?.refresh:""}));
         Cookie.set("access",response.data.tokens?.access);
         Cookie.set("refresh",response.data.tokens?.refresh);
         
         storeDispatch(setUserStatus(true));
         storeDispatch(setUserStatusInitially(true));
    storeDispatch(setUserLoginTime(Date.now().toString()));
        router.push('/activeoi');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.log('Error while login', error);
    }
  };


  const checkTimer =()=>{
    const currentTime = Date.now();
    const elapsed = currentTime - parseInt(LoginTime, 10);
    if (elapsed >= 60 * 1000) {
      Cookie.remove("access")
        Cookie.remove("refresh")
        storeDispatch(setUserStatus(false));
        router.push('/login');
    storeDispatch(setUserLoginTime(""));
    }
    }
  // -----------GET NEW REFRESH TOKEN AND STORING AFTER EVERY 55 MINS from handleSubmit function------------
  const refreshToken = async () => {
    const accessToken = Cookie.get("access");
    const refreshToken = Cookie.get("refresh");
    try {
      const newRefreshToken = await axiosInstance.post(
        API_ROUTER.REFRESH_TOKEN,
        { refresh: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      Cookie.set('access', newRefreshToken.data.tokens.access);
      storeDispatch(
        setAuth({
          ...authState,
          access: newRefreshToken?.data?.tokens?.access ? newRefreshToken?.data?.tokens?.access : ''
        })
      );
    } catch (error) {
      console.log('error getting refresh token', error);
    }
  };

  return <AuthContext.Provider value={{ ...state, data, getData, refreshToken,checkTimer }}>{children}</AuthContext.Provider>;
};
