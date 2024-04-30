"use client";
import { API_ROUTER } from "@/services/apiRouter";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import React, { createContext, useReducer,useEffect,useState } from "react";
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
        data: action.payload.data,
        isLoggedIn:action.payload.isLoggedIn
      };
    // case "CHECK_IS_LOGGEDIN":
    //   return {
    //     ...state,
    //     isLoggedIn: action.payload,
    //   };
    default:
      return state;
  }
};


export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [checkIsLoggedin,setCheckIsLoggedIn] = useState(false)
  const { push } = useRouter();

  const { data,isLoggedIn } = state;

  

  // ---------LOGIN API CALL---------
  const getData = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post(API_ROUTER.LOGIN, {
        email: email,
        password: password,
      });

      dispatch({
        type: "SET_DATA",
        payload: {data:response.data,isLoggedIn:true},
      });
      setCheckIsLoggedIn(true)
      //-------SET TOKENS IN COOKIES-----------
      Cookies.set("access", response.data?.tokens?.access);
      Cookies.set("refresh", response.data?.tokens?.refresh);

      push("/activeoi");
    } catch (error) {
      console.log("Error while login", error);
    }
  };

  // --------------LOGOUT API CALL---------------
//   const logout = async () => {
//   try {
//     const getAccessCookie = Cookies.get("access");
//     const getRefreshCookie = Cookies.get("refresh");

//     console.log("this is access cookie", getAccessCookie);
//     console.log("this is refresh cookie", getRefreshCookie);

//     await axiosInstance.post(
//       `${API_ROUTER.LOGOUT}`,
//       {
//         refresh: getRefreshCookie,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${getAccessCookie}`,
//         },
//       }
//     );
//     Cookies.remove("access");
//     Cookies.remove("refresh");
//     window.location.reload();
//   } catch (error) {
//     console.log("error in logout api", error);
//   }
// };

  // useEffect(()=>{
  //   console.log(isLoggedIn,"frrrfsdfsd")
  // },[isLoggedIn])
  

  // -------GET NEW REFRESH TOKEN AND STORING IN COKIES AFTER EVERY 55 MINS------------
  const refreshToken = async () => {
    try {
      const getAccessCookie = Cookies.get("access");
      const getRefreshCookie = Cookies.get("refresh");
      const newRefreshToken = await axiosInstance.post(
        API_ROUTER.REFRESH_TOKEN,
        { refresh: getRefreshCookie },
        {headers: {Authorization: `Bearer ${getAccessCookie}`,},}
      )
      Cookies.set("refresh", newRefreshToken);
    } catch (error) {
      console.log("error getting refresh token", error);
    }
  };
 
  return (
    <AuthContext.Provider
      value={{ ...state, data, getData, refreshToken,checkIsLoggedin,setCheckIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
