"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useState, useReducer } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { useAppSelector } from "@/store";
import useAuth from "@/hooks/useAuth";

export const FiiDiiDataContext = createContext({});

const initialState = {
  apiData: [],
  selectedClient: "",
  updatedData: [],
  filteredClientData: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        apiData: action.payload,
      };
    case "FILTERED_CLIENT":
      return {
        ...state,
        filteredClientData: action.payload,
      };
    default:
      return state;
  }
};

export const FiiDiiDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  const { handleResponceError } = useAuth();
  const router = useRouter();

  const { selectedClient, apiData, updatedData, filteredClientData } = state;
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  //------------------API CALL----------------
  const handleFetch = async () => {
    if(!authState && checkUserIsLoggedIn){
      return router.push('/login');
    }
    setIsLoading(true)
    try {
      const response = await axiosInstance.get(API_ROUTER.LIST_MARKET_DATAL, {
        headers: { Authorization: `Bearer ${authState.access}` },
      });
      const fullData = response.data; 
      if(response.status===200){
      dispatch({
        type: "SET_DATA",
        payload: fullData,
      });
      const initialFilteredClient = fullData.filter(
        (item) => item?.client_type === "FII"
      );
      dispatch({ type: "FILTERED_CLIENT", payload: initialFilteredClient });
      // const currentPath = window.location.pathname;
      // localStorage.setItem('lastPath', currentPath);
      setIsLoading(false)
    }else{
      router.push("/login");
    }
    } catch (err) {
      handleResponceError()
    }
  };

  const checkClientType = (event) => {
    const checkClient = event.target.value;
    const filteredClient = apiData.filter(
      (item) => item?.client_type === checkClient
    );
    dispatch({ type: "FILTERED_CLIENT", payload: filteredClient });
  };
 
  

  return (
    <FiiDiiDataContext.Provider
      value={{
        checkClientType,
        isLoading,
        selectedClient,
        apiData,
        updatedData,
        handleFetch,
        filteredClientData,
      }}
    >
      {children}
    </FiiDiiDataContext.Provider>
  );
};
