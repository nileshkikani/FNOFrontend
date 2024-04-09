"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
// import axios from "axios";
import React, { createContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";

export const CashflowContext = createContext({});

const initialState = {
  data: [],
  isLoading: true,
  uniqueSymbolData: [],
  selectedStock: "",
  selectedDate: "",
  uniqueDates: [],
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
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_UNIQUE_DATES":
      return {
        ...state,
        uniqueDates: action.payload,
      };

    default:
      return state;
  }
};

export const CashflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isLoading, uniqueSymbolData, selectedStock, uniqueDates, data } =
    state;

  const handleDropdownChange = (event) => {
    dispatch({ type: "SET_SELECTED_STOCK", payload: event.target.value });
  };

  const selectedStockData = uniqueSymbolData.find(
    (stockData) => stockData[0]?.symbol === selectedStock
  );

  const handleDateDropdown = (event) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: event.target.value });
  };

  const getData = async () => {
    // ----------API CALL------------------
    await axiosInstance
      .get(`${API_ROUTER.CASH_FLOW_TOP_TEN}`)
      .then((response) => {
        const responseData = response.data;

        // ----GETTING UNIQUE DATES-------
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
        dispatch({
          type: "SET_SELECTED_STOCK",
          payload: uniqueSymbolData[0][0]?.symbol,
        });
      })
      .catch((err) => {
        toast.error("error getting cashflow data");
        console.log("error is this:", err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <CashflowContext.Provider
      value={{
        isLoading,
        handleDropdownChange,
        handleDateDropdown,
        uniqueSymbolData,
        uniqueDates,
        selectedStock,
        selectedStockData,
        data,
      }}
    >
      {children}
    </CashflowContext.Provider>
  );
};
