"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import Cookies from "js-cookie";
// import axios from "axios";
import React, { createContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";

export const CashflowContext = createContext({});

const initialState = {
  data: [],
  isLoading: true,
  uniqueSymbolData: [],
  selectedStock: [],
  selectedDate: "",
  uniqueDates: [],
  dateWiseFilter: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
        isLoading: false,
      };
    case "SET_UNIQUE_SYMBOL_DATA":
      return {
        ...state,
        uniqueSymbolData: action.payload,
      };
    case "SET_SELECTED_STOCK":
      return {
        ...state,
        selectedStock: action.payload,
      };
    // case "SET_UNIQUE_DATES":
    //   return {
    //     ...state,
    //     uniqueDates: action.payload,
    //   };
    // case "DATEWISE_FILTER":
    //   return { ...state, dateWiseFilter: action.payload };
    // case "SELECTED_DATE":
    //   return {
    //     ...state,
    //     selectedDate: action.payload,
    //   };

    default:
      return state;
  }
};

export const CashflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    isLoading,
    uniqueSymbolData,
    selectedStock,
    uniqueDates,
    data,
    selectedDate,
    dateWiseFilter,
  } = state;

  // ----------API CALL------------------
  const getData = async () => {
    const token = Cookies.get("access");
    await axiosInstance
      .get(API_ROUTER.CASH_FLOW_TOP_TEN, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const responseData = response.data;

        // -----------GETTING UNIQUE DATES----------
        const uniqueDatesSet = new Set();
        response.data.forEach((item) => {
          const date = new Date(item?.created_at);
          const options = { day: "2-digit", month: "2-digit", year: "numeric" };
          const formattedDate = date.toLocaleDateString("en-US", options);
          uniqueDatesSet.add(formattedDate);
        });

        dispatch({
          type: "SET_UNIQUE_DATES",
          payload: Array.from(uniqueDatesSet),
        });

        //-------STOCK LIST------
        const symbolMap = new Map();
        responseData.forEach((item) => {
          const symbol = item.symbol;
          if (symbolMap.has(symbol)) {
            symbolMap.get(symbol).push(item);
          } else {
            symbolMap.set(symbol, [item]);
          }
        });

        const uniqueSymbolData = Array.from(symbolMap.values());
        dispatch({ type: "SET_UNIQUE_SYMBOL_DATA", payload: uniqueSymbolData });
        dispatch({ type: "SET_DATA", payload: responseData });
      })
      .catch((err) => {
        toast.error("error getting cashflow data");
        console.log("error is this:", err);
      });
  };

  //------------DATE DROPDOWN------------
  const handleDateDropdown = (event) => {
    const d = event.target.value;
    // Function to change date format from MM/DD/YYYY to DD/MM/YYYY
    const changeDateFormat = (dateString) => {
      const parts = dateString.split("/");
      return parts[1] + "/" + parts[0] + "/" + parts[2];
    };

    const formattedSelectedDate = changeDateFormat(d);
    dispatch({ type: "SELECTED_DATE", payload: formattedSelectedDate });

    // console.log("new format is :===", formattedSelectedDate);
    const dateWise = selectedStock.filter((item) => {
      const itemDate = new Date(item?.created_at).toLocaleDateString();
      return itemDate === formattedSelectedDate;
    });
    dispatch({ type: "DATEWISE_FILTER", payload: dateWise });
  };

  // ----------------------STOCK DROPDOWN----------------------
  const handleStockDropdown = (event) => {
    const selectedStockData = data.filter(
      (item) => item.symbol === event.target.value
    );
    dispatch({ type: "SET_SELECTED_STOCK", payload: selectedStockData });
  };


  return (
    <CashflowContext.Provider
      value={{
        isLoading,
        handleStockDropdown,
        handleDateDropdown,
        getData,
        uniqueSymbolData,
        uniqueDates,
        selectedStock,
        selectedDate,
        dateWiseFilter,
        data,
      }}
    >
      {children}
    </CashflowContext.Provider>
  );
};
