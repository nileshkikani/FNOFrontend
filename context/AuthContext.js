"use client";
import { API_ROUTER } from "@/services/apiRouter";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import React, { createContext, useEffect, useReducer } from "react";
// import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext({});

const initialState = {
  data: [],
  isLoggedIn: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
    case "CHECK_IS_LOGGEDIN":
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { push } = useRouter();
  //
  const { data, isLoggedIn } = state;

  // ---------LOGIN API CALL---------
  const getData = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post(API_ROUTER.LOGIN, {
        email: email,
        password: password,
      });

      dispatch({
        type: "SET_DATA",
        payload: response.data,
      });

      dispatch({
        type: "CHECK_IS_LOGGEDIN",
        payload: true,
      });

      //-------set tokens in cookies-----------
      Cookies.set("access", response.data?.tokens?.access);
      Cookies.set("refresh", response.data?.tokens?.refresh);

      push("/activeoi");//--------redirect to live chart page-----
    } catch (error) {
      console.log("Error while login", error);
    }
  };

  // console.log("current state is ", isLoggedIn);

  // ---------LOGOUT API CALL---------
  // const logout = async()=>{
  //   console.log("inside logout functionnnnn------");
  //   try {
  //     const getRefreshCookie = Cookies.get('access');
  //     console.log("this is access cookie-----------0-0-0-0-0",getRefreshCookie);
  //     const logoutResponse = await axios.get(`http://192.168.0.179:8000/${API_ROUTER.LOGOUT}`,{headers:{ Authorization: `Bearer ${getRefreshCookie}` }})

  //   } catch (error) {
  //     console.log("error in logout api",error);
  //   }
  // }

  // useEffect(() => {
  //   if (localStorage.getItem("access")) {
  //     dispatch({
  //       type: "CHECK_IS_LOGGEDIN",
  //       payload: true,
  //     });
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ ...state, isLoggedIn, data, getData }}>
      {children}
    </AuthContext.Provider>
  );
};
