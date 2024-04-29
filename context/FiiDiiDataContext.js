"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import React, { createContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";
// import axios from "axios";
import Cookies from "js-cookie";

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

  const { selectedClient, apiData, updatedData, filteredClientData } = state;

  //------------------API CALL----------------
  const handleFetch = async () => {
    try {
      const token = Cookies.get("access");
      const response = await axiosInstance.get(API_ROUTER.LIST_MARKET_DATAL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fullData = response.data;
      dispatch({
        type: "SET_DATA",
        payload: fullData,
      });
      const initialFilteredClient = fullData.filter(
        (item) => item?.client_type === "FII"
      );
      dispatch({ type: "FILTERED_CLIENT", payload: initialFilteredClient });
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

  // // ------------- DIFFERENCE CALCULATIONS AS SELECTED FROM DROPDOWN-----------
  // const {
  //   future_index_long,
  //   future_index_short,
  //   future_stock_long,
  //   future_stock_short,
  //   option_index_call_long,
  //   option_index_call_short,
  //   option_index_put_long,
  //   option_index_put_short,
  //   option_stock_call_long,
  //   option_stock_call_short,
  //   option_stock_put_long,
  //   option_stock_put_short,
  //   total_long_contracts,
  //   total_short_contracts,
  // } = filteredClientData[0];

  // //---------------STORING CALCULATION-----------
  // const finalResult = {
  //   future_index_diff: future_index_long - future_index_short,
  //   future_stock_diff: future_stock_long - future_stock_short,
  //   option_index_call_diff: option_index_call_long - option_index_call_short,
  //   option_index_put_diff: option_index_put_long - option_index_put_short,
  //   option_stock_call_diff: option_stock_call_long - option_stock_call_short,
  //   option_stock_put_diff: option_stock_put_long - option_stock_put_short,
  //   total_contracts_diff: total_long_contracts - total_short_contracts,
  // };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <FiiDiiDataContext.Provider
      value={{
        checkClientType,
        selectedClient,
        apiData,
        // finalResult,
        updatedData,
        filteredClientData,
      }}
    >
      {children}
    </FiiDiiDataContext.Provider>
  );
};
