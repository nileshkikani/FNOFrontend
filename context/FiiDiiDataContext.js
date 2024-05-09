"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { useAppSelector } from "@/store";

export const FiiDiiDataContext = createContext({});

const initialState = {
  apiData: [],
  isLoading: true,
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
        isLoading: false,
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
  const router = useRouter();

  const { selectedClient, apiData, updatedData, filteredClientData } = state;
  const authState = useAppSelector((state) => state.auth.authState);

  //------------------API CALL----------------
  const handleFetch = async () => {
    if(!authState){
      return
    }
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
    }else{
      router.push("/login");
    }
    } catch (err) {
      toast.error("Error getting data FII DII");
      console.log("Error:", err);
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
        selectedClient,
        apiData,
        // finalResult,
        updatedData,
        handleFetch,
        filteredClientData,
      }}
    >
      {children}
    </FiiDiiDataContext.Provider>
  );
};
